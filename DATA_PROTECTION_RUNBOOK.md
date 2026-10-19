# UPSC Gurukul — Data Protection and User Rights Runbook

Official public contact: email@pratyushswain.in
Platform: UPSC गुरुकुल

## 1. Purpose

This document describes the manual process for receiving and handling privacy
requests. It is an operational checklist, not a claim that automated deletion,
request tracking, or legal compliance has already been implemented.

## 2. Request types

The Data Rights Request page at /data-rights.html lets a person prepare an email
request concerning:

- Access to personal data
- Correction of personal data
- Deletion of personal data
- Withdrawal of optional consent
- Privacy questions or other requests

The current form opens the user's email application. It does not itself send,
store, or track the request. A request is received only when it reaches the
official inbox.

## 3. Intake procedure

When a request arrives at email@pratyushswain.in:

1. Record the date received and a minimal reference number in a restricted
   request register.
2. Record the request type and status. Avoid copying unnecessary personal
   information into the register.
3. Acknowledge receipt where appropriate, explaining that verification may
   be required before action.
4. Identify the relevant account or data systems without requesting passwords,
   one-time passwords, recovery codes, or authentication secrets.
5. Record the next action and follow-up date.

Do not claim that a request has been completed until the relevant action has
been performed and verified.

## 4. Identity verification

Before disclosing personal information or deleting account data:

1. Verify that the requester controls the relevant account or contact channel
   using an appropriate, proportionate method.
2. Do not ask the requester to send passwords or OTPs by email.
3. If the request concerns a child, a representative, or a disputed account,
   pause and assess what additional verification or authorization is appropriate.
4. If identity cannot be verified, do not disclose or delete another person's
   data. Explain the issue and the next safe step.

## 5. Access and correction requests

1. Identify which systems are relevant to the request.
2. Confirm the requester's identity before disclosing information.
3. Review the information that can appropriately be provided or corrected.
4. Apply any lawful limitations and protect other people's information.
5. Record the action taken and send a concise response.

Do not promise that every data source can be exported automatically until that
capability has been implemented and tested.

## 6. Deletion requests

Before deleting data:

1. Verify the requester's identity and the exact account involved.
2. Identify the relevant systems, which may include Firebase Authentication,
   Firestore, notification-token records, application databases, and backups.
3. Determine whether any information must or may lawfully be retained.
4. Check whether deleting a record could affect another user, shared records,
   security investigations, financial records, or administrative access.
5. Perform only the authorized deletion steps using an appropriately
   privileged account.
6. Verify the result and document any remaining records, reasons for retention,
   and limitations communicated to the requester.

Never run a bulk deletion based solely on an email address. Never delete the
platform owner's administrative account as part of a routine test.

Deleting a Firebase Authentication user does not automatically guarantee that
all related Firestore documents, notification tokens, logs, or backups have
been deleted.

## 7. Consent withdrawal

1. Identify the optional processing or feature to which the person refers.
2. Stop the relevant optional processing where applicable and technically
   supported.
3. Check whether a stored preference, provider setting, or previously issued
   token requires a separate action.
4. Explain any processing that continues on another lawful basis, if applicable.
5. Record the result without claiming that withdrawal deletes all historical data.

Browser consent preferences and server-side records are separate systems.
Changing local browser storage alone does not prove that server-side data was
removed.

## 8. Request register

Keep the register in a restricted location. Suggested fields:

- Reference number
- Date received
- Request category
- Verification status
- Current status
- Responsible person
- Next action or follow-up date
- Completion date
- Brief outcome

Do not store passwords, OTPs, full identity documents, or unnecessary copies of
the request in this register. Limit access and retention to what is necessary.

## 9. Security and access controls

- Keep Firebase service-account keys and private credentials out of Git.
- Never publish firebase-key.json or other private key files.
- Use least-privilege access for administrative operations.
- Do not rely on a client-side email comparison as the sole security control
  for privileged backend operations.
- Review Firebase Authentication and Firestore Security Rules before changing
  data access or deletion behavior.
- Do not send personal data to unverified third-party services.

The public contact email is email@pratyushswain.in. The Firebase administrator
login remains a separate configuration and must not be changed merely because
the public contact email changes.

## 10. Incident handling

If personal data may have been exposed, altered, or accessed without
authorization:

1. Preserve relevant logs and evidence.
2. Restrict ongoing unauthorized access where safe to do so.
3. Do not destroy evidence or make unsupported public claims.
4. Record the incident and assess its scope.
5. Obtain appropriate technical and legal advice about notifications,
   reporting, and required timelines.

Use the existing BREACH_RUNBOOK.md as the incident-response companion document.

## 11. Legal review

This runbook is an operational aid, not legal advice. Applicable obligations
depend on the platform's actual processing, users, providers, and current law.
Have the Privacy Policy, consent design, retention practices, children's data
handling, grievance/contact process, and request-response timelines reviewed
against applicable Indian requirements before claiming full compliance.

## 12. Current implementation status

- Data Rights Request page exists at /data-rights.html.
- The page prepares an email; it does not automatically submit or track requests.
- Public contact email: email@pratyushswain.in.
- Automated identity verification: not established by this document.
- Automated request register: not established by this document.
- Automated account/data deletion: not established by this document.
- These capabilities must be implemented and tested separately before being
  advertised as available.