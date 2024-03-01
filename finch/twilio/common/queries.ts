export const queries = {
  'user_invitation': `SELECT prefix_id AS user_prefix, first_name AS user_first_name,
       last_name AS user_last_name, mobile_phone AS user_phone_number, o.title AS org_title,
       o.phone AS org_phone_number
FROM  users
LEFT JOIN user_sites us on users.id = us.user_id
LEFT JOIN sites s on us.site_id = s.id
LEFT JOIN organizations o on s.organization_id = o.id
WHERE users.id = $1`,

  'user_verification': `SELECT prefix_id AS user_prefix, first_name AS user_first_name,
       last_name AS user_last_name, mobile_phone AS user_phone_number, o.title AS org_title,
       o.phone AS org_phone_number
FROM  users
LEFT JOIN user_sites us on users.id = us.user_id
LEFT JOIN sites s on us.site_id = s.id
LEFT JOIN organizations o on s.organization_id = o.id
WHERE users.id = $1`,

  'admin_invitation': `SELECT prefix_id AS admin_prefix, first_name AS admin_first_name,
       last_name AS admin_last_name, mobile_phone AS admin_phone_number
FROM admins
WHERE id = $1`,

  'admin_verification': `SELECT prefix_id AS admin_prefix, first_name AS admin_first_name,
       last_name AS admin_last_name, mobile_phone AS admin_phone_number
FROM admins
WHERE id = $1`,

  'user_reset_password': `SELECT prefix_id AS user_prefix, first_name AS user_first_name,
       last_name AS user_last_name, mobile_phone AS user_phone_number, o.title AS org_title,
       o.phone AS org_phone_number
FROM  users
LEFT JOIN user_sites us on users.id = us.user_id
LEFT JOIN sites s on us.site_id = s.id
LEFT JOIN organizations o on s.organization_id = o.id
WHERE users.id = $1`,

  'user_forgot_password': `SELECT prefix_id AS user_prefix, 
       first_name   AS user_first_name,
       last_name    AS user_last_name,
       mobile_phone AS user_phone_number,
       o.title      AS org_title,
       o.phone      AS org_phone_number
FROM  users
   LEFT JOIN user_sites us on users.id = us.user_id
   LEFT JOIN sites s on us.site_id = s.id
   LEFT JOIN organizations o on s.organization_id = o.id
   WHERE users.id = $1`,

  'proband_invitation': `SELECT individuals.middle_name                                           AS patient_middle_name,
       individuals.first_name                                            AS patient_first_name,
       individuals.last_name                                             AS patient_last_name,
       individuals.phone                                                 AS patient_phone_number,
       individuals.email                                                 AS patient_email,
       o.title                                                           AS org_title,
       o.phone                                                           AS org_phone_number,
       u.prefix_id                                                       AS user_prefix,
       u.first_name                                                      AS user_first_name,
       u.last_name                                                       AS user_last_name,
       u.mobile_phone                                                    AS user_phone_number,
       a.appointment_date_start_time                                     AS appointment_start_time,
       a.appointment_date_end_time                                       AS appointment_end_time,
       s.name                                                            AS site_name,
       s.phones[1]                                                       AS site_primary_phone_number,
       s.address1                                                        AS site_address1,
       s.address2                                                        AS site_address2,
       s.city                                                            AS site_city,
       s.state_id                                                        AS site_state,
       s.zip                                                             AS site_zip,
       s.country_id                                                      AS site_country,
       s.faxes[1]                                                        AS site_primary_fax_number,
       s.email                                                           AS site_email,
       s.timezone_id                                                     AS "timezoneId",
       f.name                                                            AS invitation_fhq,
       if.remote_hash                                                    AS "remoteHash",
       fl.id                                                             AS "fileId",
       $4                                                               AS  invitation_note   

FROM individuals
         LEFT JOIN sites s ON individuals.site_id = s.id
         LEFT JOIN fhqs f ON f.id = $2
         LEFT JOIN individual_fhqs if ON individuals.id = if.individual_id
         LEFT JOIN fhq_branding fb on s.id = fb.site_id
         LEFT JOIN files fl ON fb.email_logo_file_id = fl.id
         LEFT JOIN organizations o ON s.organization_id = o.id
         LEFT JOIN appointments a ON a.id = $3
         LEFT JOIN users u on a.user_id = u.id           
         WHERE individuals.id = $1 AND is_proband = true AND individuals.deleted_at IS NULL`,

  'admin_reset_password': `SELECT prefix_id AS admin_prefix, 
      first_name   AS admin_first_name,
      last_name    AS admin_last_name,
      mobile_phone AS admin_phone_number
FROM admins
  WHERE id = $1`,

  'proband_forgot_password': `SELECT middle_name AS patient_middle_name,
       first_name        AS patient_first_name,
       last_name         AS patient_last_name,
       individuals.phone AS patient_phone_number,
       individuals.email AS patient_email,
       o.title           AS org_title,
       o.phone           AS org_phone_number,
       if.remote_hash    AS  "remoteHash",
       fl.id             AS "fileId"
FROM  individuals
LEFT JOIN sites s on individuals.site_id = s.id
LEFT JOIN fhq_branding fb on s.id = fb.site_id
LEFT JOIN files fl ON fb.email_logo_file_id = fl.id
LEFT JOIN organizations o on s.organization_id = o.id
LEFT JOIN individual_fhqs if ON  if.remote_hash = $2
WHERE individuals.id = $1 AND is_proband = true`,

  'proband_reminder': `SELECT individuals.middle_name                                           AS patient_middle_name,
       individuals.first_name                                            AS patient_first_name,
       individuals.last_name                                             AS patient_last_name,
       individuals.phone                                                 AS patient_phone_number,
       individuals.email                                                 AS patient_email,
       o.title                                                           AS org_title,
       o.phone                                                           AS org_phone_number,
       u.prefix_id                                                       AS user_prefix,
       u.first_name                                                      AS user_first_name,
       u.last_name                                                       AS user_last_name,
       u.mobile_phone                                                    AS user_phone_number,
       appointment."startDate"                                           AS appointment_start_time,
       appointment."endDate"                                             AS appointment_end_time,
       s.name                                                            AS site_name,
       s.phones[1]                                                       AS site_primary_phone_number,
       s.address1                                                        AS site_address1,
       s.address2                                                        AS site_address2,
       s.city                                                            AS site_city,
       s.state_id                                                        AS site_state,
       s.zip                                                             AS site_zip,
       s.country_id                                                      AS site_country,
       s.faxes[1]                                                        AS site_primary_fax_number,
       s.email                                                           AS site_email,
       s.timezone_id                                                     AS "timezoneId",
       f.name                                                            AS invitation_fhq,
       if.remote_hash                                                    AS "remoteHash",
       fl.id                                                             AS "fileId",
       $3                                                                AS reminder_note

FROM individuals
         LEFT JOIN sites s ON individuals.site_id = s.id
         LEFT JOIN fhqs f ON f.id = $2
         LEFT JOIN individual_fhqs if ON individuals.id = if.individual_id
         LEFT JOIN fhq_branding fb on s.id = fb.site_id
         LEFT JOIN files fl ON fb.email_logo_file_id = fl.id
         LEFT JOIN organizations o ON s.organization_id = o.id
         LEFT JOIN (SELECT DISTINCT ON (appointments.individual_id) individual_id,
                                                                    id,
                                                                    user_id,
                                                                    min(appointment_date_start_time) AS "startDate",
                                                                    appointment_date_end_time        AS "endDate"
                    FROM appointments
                    WHERE appointment_date_end_time >= NOW()
                      AND appointments.deleted_at IS NULL
                    GROUP BY individual_id, id
                    ORDER BY individual_id, "startDate") appointment ON appointment.individual_id = individuals.id
         LEFT JOIN users u on appointment.user_id = u.id           
WHERE individuals.id = $1
  AND is_proband = true
  AND individuals.deleted_at IS NULL`,
};
