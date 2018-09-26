'use strict';

$(function() {

    // Setup signature request

    var email_consent_sigrequest = {
        data: 'foobar',
        validity: 60,
        timeout: 60,
        request: {
            messageType: 'STRING',
            content: [
                {
                    label: 'email',
                    attributes: ['pbdf.pbdf.email.email'],
                },
            ],
        },
    };

    var donation_sigrequest = {
        data: 'foobar',
        validity: 60,
        timeout: 60,
        request: {
            messageType: 'STRING',
            content: [
                {
                    label: 'name',
                    attributes: [
                        'pbdf.pbdf.idin.familyname',
                        'pbdf.pbdf.facebook.familyname',
                        'pbdf.pbdf.linkedin.familyname',
                        'pbdf.pbdf.twitter.fullname',
                        'pbdf.nijmegen.personalData.fullname',
                    ],
                },
                {
                    label: 'mobile',
                    attributes: ['pbdf.pbdf.mobilenumber.mobilenumber'],
                },
            ],
        },
    };

    var exam_sigrequest = {
        data: 'foobar',
        validity: 60,
        timeout: 60,
        request: {
            messageType: 'STRING',
            content: [
                {
                    label: 'name',
                    attributes: ['pbdf.pbdf.surfnet.fullname', 'pbdf.pbdf.surfnet-2.fullname'],
                },
                {
                    label: 'institute',
                    attributes: ['pbdf.pbdf.surfnet.institute', 'pbdf.pbdf.surfnet-2.institute'],
                },
                {
                    label: 'email',
                    attributes: ['pbdf.pbdf.surfnet.email', 'pbdf.pbdf.surfnet-2.email'],
                },
                {
                    label: 'employee',
                    attributes: {'pbdf.pbdf.surfnet.type': 'employee', 'pbdf.pbdf.surfnet-2.type': 'employee'},
                },
            ],
        },
    };

    function getDate() {
        var now = new Date();
        return ((now.getDate()) + ' / ' +
                (now.getMonth() + 1) + ' / ' +
                (now.getFullYear()));
    }

    function getNextYearDate() {
        var now = new Date();
        return ((now.getDate()) + ' / ' +
                (now.getMonth() + 1) + ' / ' +
                (now.getFullYear() + 1));
    }

    function setupSignButton(button, resultStatus, sigrequestTemplate, messageFunc, successMessageFunc) {
        var onSuccess = function(data) {
            console.log('Signature successful!');
            var token = jwt_decode(data);
            console.log('Signature token:', token);
            resultStatus.html('<div class="alert alert-success"><div class="prefix"></div><blockquote class="blockquote signedText"></blockquote></div>');
            $('.prefix', resultStatus).html(successMessageFunc(token.attributes).html());
            $('.signedText', resultStatus).html(token.signature.message);
        };
        function onCancel() {
            console.log('Signing cancelled!');
            resultStatus.html('<div class="alert alert-warning"></div>');
            $('div', resultStatus).text(MESSAGES['cancel-message']);
        };
        function onError(data) {
            console.log('Signing failed!');
            console.log('Error data:', data);
            resultStatus.html('<div class="alert alert-danger"><p><strong class="header"></strong></p><p><small><span class="errormsg"></span>: <span class="data"></span></small></div>');
            $('.error', resultStatus).text(MESSAGES['error']);
            $('.errormsg', resultStatus).text(MESSAGES['errormsg']);
            $('.data', resultStatus).text(data);
        };
        button.click(function() {
            var sigrequest = JSON.parse(JSON.stringify(sigrequestTemplate)); // https://stackoverflow.com/a/5344074/559350
            sigrequest.request.message = messageFunc();
            console.log('signing message:', sigrequest.request.message);
            var jwt = IRMA.createUnsignedSignatureJWT(sigrequest);
            IRMA.sign(jwt, onSuccess, onCancel, onError);
        });
    }

    // Email

    setupSignButton($('#btn_email_consent'), $('#email_consent_result_status'), email_consent_sigrequest, function() {
        return MESSAGES['email-message'].replace('{year}', getNextYearDate());
    }, function (attributes) {
        var message = $(MESSAGES['email-success']);
        $('.attribute.email', message).text(attributes['pbdf.pbdf.email.email']);
        return message;
    });

    // Donation

    setupSignButton($('#btn_donation'), $('#donation_result_status'), donation_sigrequest, function() {
        return MESSAGES['donation-message'];
    }, function(attributes) {
        var options = [
            'pbdf.pbdf.idin.familyname',
            'pbdf.pbdf.facebook.familyname',
            'pbdf.pbdf.linkedin.familyname',
            'pbdf.pbdf.twitter.fullname',
            'pbdf.nijmegen.personalData.fullname',
        ];
        console.log(options);
        for (var i=0; i<options.length; i++) {
            if (options[i] in attributes) {
                var name = attributes[options[i]];
            }
        }
        console.log(name);
        var number = attributes['pbdf.pbdf.mobilenumber.mobilenumber'];
        var el = $(MESSAGES['donation-success']);
        $('.attribute.name', el).text(name);
        $('.attribute.number', el).text(number);
        return el;
    });

    // Exam stuff

    setupSignButton($('#btn_exam'), $('#exam_result_status'), exam_sigrequest, function() {
        return MESSAGES['exam-message'].replace('{date}', getDate());
    }, function(attributes) {
        var el = $(MESSAGES['exam-success']);
        var credid = attributes.hasOwnProperty('pbdf.pbdf.surfnet.fullname') ? 'pbdf.pbdf.surfnet' : 'pbdf.pbdf.surfnet-2';
        $('.attribute.name', el).text(attributes[credid + '.fullname']);
        $('.attribute.institute', el).text(attributes[credid + '.institute']);
        $('.attribute.email', el).text(attributes[credid + '.email']);
        $('.attribute.employee', el).text(attributes[credid + '.type']);
        return el;
    });
});


