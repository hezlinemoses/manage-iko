from __future__ import print_function
import logging
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from urllib3.exceptions import MaxRetryError
logging.basicConfig(level=logging.DEBUG)

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = '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'

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))


def sendmail():
    subject = "Manage-iko Team Invitation"
    sender = {"name":"Manage-iko admin","email":"contact@contact.com"}
    # replyTo = {"name":"Sendinblue","email":"contact@sendinblue.com"}
    html_content = "<html><body><h1>This is my first transactional email </h1></body></html>"
    to = [{"email":"shawk.000@gmail.com","name":"hezline"}]
    params = {"parameter":"My param value","subject":"New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to,html_content=html_content, sender=sender, subject=subject)
    try:
        api_response = api_instance.send_transac_email(send_smtp_email, async_req=True)  ##remove async_req to call fn in syn mode
        (api_response)
    except ApiException as e:
        logging.error("Exception when calling SMTPApi->send_transac_email: %s\n" % e)
    except MaxRetryError as e:
        logging.error("Something wrong with connection!")
        ##change invitation status or something in model and add a feature to reinvite the user