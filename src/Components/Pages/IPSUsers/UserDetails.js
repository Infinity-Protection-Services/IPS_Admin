import React, { useState } from 'react'
import { withNamespaces } from "react-i18next";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { commonMethods } from '../../../Utils'
import { Back_arrow } from "../../../Assets/Images/web";
import moment from 'moment';

export const RenderHeading = ({ heading }) => {
  return <div className="input-group mt-13 ">
    <div className="Heading-Wrapper">
      <span className="details-text user-detail-heading">{heading}</span>
    </div>
  </div>
}

export const RenderDetails = (props) => {
  const { label, value } = props
  return <div className="label">
    <p className="job-detail-label-p ">{label}</p>
    <div className="detail d-flex">:  <span className="details_width_wrapper">
      {value}
    </span>
    </div>
  </div>
}

const DocumentPreview = (props) => {
  const { url, status } = props

  // url.match(/\.(jpeg|jpg|gif|png|pdf)$/) != null ? window.open(url, '_blank').focus() : window.open(`https://docs.google.com/viewer?url=${url}&embedded=true?time=${Date.parse(new Date())}`, '_blank').focus()

  return <Modal isOpen={status} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabindex="-1" toggle={props.onClose}>
    <div className="modal-content">
      <ModalHeader toggle={props.onClose}>{props.children}</ModalHeader>
      <ModalBody>
        {
          url.match(/\.(jpeg|jpg|gif|png)$/) != null ?
            <img src={url} width="100%" alt="document" />
            :
            url.match(/\.(pdf)$/) != null ?
              <iframe style={{ width: "100%", height: "500px" }} src={url} alt="document"  ></iframe>
              :
              <iframe style={{ width: "100%", height: "500px" }} src={`https://docs.google.com/viewer?url=${url}&embedded=true`} alt="document"  ></iframe>
        }
      </ModalBody>
    </div>
  </Modal>

}

function UserDetails(props) {
  const { userDetail } = props
  const urlRegExp = /(ftp|http|https):\/\/(\w+:{0, 1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  const [previewContent, setContentToPreview] = useState({ visibility: false, title: "" })
  return (
    <>
      <div className="input-group Heading-Wrapper-container">
        <div className="form-outline Heading-Wrapper">
          <img src={Back_arrow} className="back-arrow" onClick={props.onClose} alt="back arrow" />
          <span className="details-text">{commonMethods.ConvertToCamelCase(userDetail.first_name + " " + userDetail.last_name) + " (" + (userDetail.user_role_id || "-") + ")"}</span>
        </div>
      </div>
      <div className="order-detail-table-wrapper remove-border new-job-detail-table-wrapper user-detail-wrapper">
        <div className="job-requester-details">
          <div className="ml-20 detail-wrapper w-100p">
            <div className="job-overview-wrapper">
              <div className="mr-30">
                {
                  userDetail.temp_role_id === 3 ?
                    <>
                      {urlRegExp.test(userDetail.photo) ? <img src={userDetail.photo} className="user-image" alt="user" /> : ""}
                      {/* Personal details */}
                      <RenderHeading heading={props.t("Personal Details")} />
                      <div className="mt-13">
                        <RenderDetails label={props.t("Name")} value={commonMethods.ConvertToCamelCase(userDetail.first_name + " " + userDetail.last_name)} />
                      </div>
                      {/* milestone 4 chnages */}
                      {/* <RenderDetails label={props.t("Birth date")} value={userDetail.date_of_birth || "-"} /> */}
                      <RenderDetails label={props.t("Languages Spoken")} value={userDetail.language_spoken ? (userDetail.language_spoken.split(",")).join(", ") : "-"} />
                      <RenderDetails label={props.t("Street Address")} value={commonMethods.ConvertToCamelCase(userDetail.address || "-") || "-"} />
                      <RenderDetails label={props.t("City")} value={commonMethods.ConvertToCamelCase(userDetail.city || "-")} />
                      <RenderDetails label={props.t("State")} value={commonMethods.ConvertToCamelCase(userDetail.state || "-")} />
                      <RenderDetails label={props.t("Zipcode")} value={userDetail.zipcode || "-"} />
                      <RenderDetails label={props.t("Height")} value={userDetail.descriptive_items || "-"} />
                      <RenderDetails label={props.t("Weight")} value={userDetail.descriptive_items_weight ? userDetail.descriptive_items_weight + " lb" : "-"} />

                      {/* milestone 4 changes */}
                      {/* {
                                                userDetail.personal_extra_information ?
                                                    <RenderDetails label={props.t("Personal extra information")} value={
                                                        <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                            setContentToPreview({ visibility: userDetail.personal_extra_information_document, title: props.t("Personal extra information") })
                                                        }}>{props.t("View document")}</span>
                                                    } />
                                                    :
                                                    <RenderDetails label={props.t("Personal extra information")} value={commonMethods.ConvertToCamelCase(userDetail.personal_extra_information_description || "-")} />
                                            } */}

                      {/* Contact Details */}
                      <RenderHeading heading={props.t("Contact Details")} />
                      <div className="mt-13"><RenderDetails label={props.t("Phone Number")} value={userDetail.phone_no || "-"} /></div>
                      <RenderDetails label={props.t("Telephone Number")} value={userDetail.telephone_no || "-"} />
                      <RenderDetails label={props.t("Email")} value={userDetail.email || "-"} />
                      {userDetail.alternate_email && <RenderDetails label={props.t("Alternate Email")} value={userDetail.alternate_email || "-"} />}

                      {/* Due diligence */}
                      <RenderHeading heading={props.t("Due Diligence")} />
                      <div className="mt-13">
                        <RenderDetails label={props.t("Criminal history")}
                          value={
                            userDetail.criminal_history === 0 ?
                              <span className="color-red">{props.t("No")}</span> :
                              userDetail.criminal_history === 1 ? <span className="color-green">{props.t("Yes")}</span> : "-"
                          }
                        />
                      </div>
                      <RenderDetails label={props.t("Citizenship")} value={userDetail.citizenship || "-"} />
                      <RenderDetails label={props.t("Security License(s)")}
                        value={
                          userDetail.security_licensing === 0 ?
                            <span className="color-red">{props.t("No")}</span> :
                            userDetail.security_licensing === 1 ? <span className="color-green">{props.t("Yes")}</span> : ""
                        }
                      />
                      {
                        userDetail.security_licensing ?
                          <RenderDetails label={props.t("Security License")} value={
                            (userDetail.security_license_document.split(",")).map(item => {
                              return urlRegExp.test(item) ?
                                <li> <span className="color-sidebar td-underline cur-point" onClick={() => {
                                  setContentToPreview({ visibility: item, title: props.t("Security licence") })
                                }}>{props.t("View document")}</span>
                                </li>
                                :
                                <span>-</span>
                            })
                          } />
                          :
                          <RenderDetails label={props.t("Security Licensing Description")} value={userDetail.security_license_description || "-"} />
                      }

                      {userDetail.criminal_history ? <RenderDetails label={props.t("Criminal History Description")} value={userDetail.criminal_history_description || "-"} /> : ""}

                      <RenderDetails label={props.t("SSN")} value={userDetail.ssn || "-"} />
                      {/* <RenderDetails label={props.t("State")} value={userDetail.state || "-"} /> */}
                      <RenderDetails label={props.t("DOB")} value={moment(userDetail.date_of_birth).format('MMM DD, YYYY') || "-"} />

                      {
                        userDetail.citizenship ? userDetail.citizenship.toLowerCase() !== "united states" ?
                          <>
                            <RenderDetails label={props.t("Authorization To Work")}
                              value={
                                userDetail.authorization_to_work === 0 ?
                                  <span className="color-red">{props.t("No")}</span> :
                                  userDetail.authorization_to_work === 1 ? <span className="color-green">{props.t("Yes")}</span> : "-"
                              }
                            />
                            {userDetail.authorization_to_work ?
                              <RenderDetails label={props.t("Authorization To Work Document")} value={
                                <span className="color-sidebar td-underline cur-point" onClick={() => {
                                  setContentToPreview({ visibility: userDetail.authorization_to_work_document, title: props.t("Authorization to work document") })
                                }}>{props.t("View document")}</span>
                              } />
                              : <RenderDetails label={props.t("Authorization To Work Description")} value={userDetail.authorization_to_work_description || "-"} />}
                          </>
                          : <>
                            <RenderDetails label={props.t("Authorization To Work")}
                              value={
                                <span className="color-green">{props.t("Yes")}</span>
                              }
                            />
                          </>
                          :
                          <>
                            <RenderDetails label={props.t("Authorization To Work")} value="-" />
                          </>
                      }

                      {userDetail.due_diligence_extra_information ?
                        <RenderDetails label={props.t("Due Diligence Eexplanation")} value={
                          <span className="color-sidebar td-underline cur-point" onClick={() => {
                            setContentToPreview({ visibility: userDetail.due_diligence_extra_information_document, title: props.t("Due diligence explanation") })
                          }}>{props.t("View document")}</span>
                        } />
                        :
                        userDetail.due_diligence_description ?
                          <RenderDetails label={props.t("View Due Diligence Explanation")} value={userDetail.due_diligence_description || "-"} />
                          : ""
                      }
                      {
                        userDetail.criminal_offenses_explaination ?
                          <RenderDetails label={props.t("Criminal Offense Explanation")} value={userDetail.criminal_offenses_explaination || "-"} />
                          : ""
                      }

                      {/* Educational background */}
                      <RenderHeading heading={props.t("Education & Training")} />
                      <div className="mt-13">
                        <RenderDetails label={props.t("Security Speciality")} value={userDetail.security_speciality || "-"} />
                      </div>
                      <RenderDetails label={props.t("Veteran or Prior Emergency Responder Experience")}
                        value={
                          userDetail.emergengy_responder_experience === 0 ?
                            <span className="color-red">{props.t("No")}</span> :
                            userDetail.emergengy_responder_experience === 1 ? <span className="color-green">{props.t("Yes")}</span> : ""
                        }
                      />
                      {userDetail.emergengy_responder_experience === 1 &&
                        <RenderDetails label={props.t("Military Discharge Documents")} value={
                          (userDetail.veternal_document.split(",")).map(item => {
                            return <li> <span className="color-sidebar td-underline cur-point" onClick={() => {
                              setContentToPreview({ visibility: item, title: props.t("Military Discharge Documents") })
                            }}>{props.t("View document")}</span>
                            </li>
                          })
                        } />
                      }

                      {userDetail.additional_licence_certificate_creadentials &&
                        <RenderDetails label={props.t("Additional Licensing, Certification And Credentials")} value={userDetail.additional_licence_certificate_creadentials || "-"} />
                      }
                      {userDetail.relevant_training_courses &&
                        <RenderDetails label={props.t("Relevant Training Course")} value={commonMethods.ConvertToCamelCase(userDetail.relevant_training_courses) || "-"} />
                      }
                      <RenderDetails label={props.t("Education")} value={userDetail.qualification || "-"} />
                      <RenderDetails label={props.t("School Name")} value={userDetail.institute || "-"} />
                      <RenderDetails label={props.t("Education & Training documents")} value={userDetail.resume ?
                        (userDetail.resume.split(",")).map(item => {
                          return urlRegExp.test(item) ?
                            <li>
                              <span className="color-sidebar td-underline cur-point" onClick={() => {
                                setContentToPreview({ visibility: item, title: props.t("Education & Training documents") })
                              }}>{props.t("View document")}</span>
                            </li>
                            :
                            <span>-</span>
                        })
                        : "-"}
                      />
                      {/* milestone 4 changes */}
                      {/* {
                                                userDetail.education_and_training_extra_information ?
                                                    <RenderDetails label={props.t("View explanation")} value={
                                                        <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                            setContentToPreview({ visibility: userDetail.veternal_document, title: props.t("View explanation") })
                                                        }}>{props.t("Education & Training explanation")}</span>
                                                    } />
                                                    :
                                                    <RenderDetails label={props.t("Education & Training explanation")} value={commonMethods.ConvertToCamelCase(userDetail.education_and_training_extra_information_description || "-")} />
                                            } */}

                      {/* milestone 4 changes */}
                      {/* {userDetail.emergengy_responder_experience ?
                                                <RenderDetails label={props.t("View veteran or prior emergency responder experience")} value={
                                                    (userDetail.veternal_document.split(",")).map(item => {
                                                        return <li> <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                            setContentToPreview({ visibility: item, title: props.t("Emergency responder experience") })
                                                        }}>{props.t("View document")}</span>
                                                        </li>
                                                    })
                                                } />
                                                : ""
                                            } */}

                      {/* Identity */}
                      <RenderHeading heading={props.t("Identity")} />
                      {userDetail.is_licence_available == 1 ?
                        <>
                          <div className="mt-13"><RenderDetails label={props.t("ID type")} value={userDetail.licence_document_type || "-"} /></div>
                          <RenderDetails label={props.t("ID Number")} value={userDetail.licence_id || "-"} />
                          <RenderDetails label={props.t("State")} value={userDetail.licence_state || "-"} />
                          <RenderDetails label={props.t("Country")} value={userDetail.licence_country || "-"} />
                          <RenderDetails label={props.t("Licence")} value={
                            <span className="color-sidebar td-underline cur-point" onClick={() => {
                              setContentToPreview({ visibility: userDetail.licence_doc, title: props.t("Licence") })
                            }}>{props.t("View document")}</span>
                          } />
                        </>
                        : <>
                          <div className="mt-13">
                            <RenderDetails label={props.t("ID Unavailability Description")} value={commonMethods.ConvertToCamelCase(userDetail.licence_description) || "-"} />
                          </div>
                        </>
                      }
                      {/* milestone 4v changes */}
                      {/* {userDetail.state_or_country_license_extra_information ?
                                                <>
                                                    <RenderDetails label={props.t("Explanation document")} value={
                                                        <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                            setContentToPreview({ visibility: userDetail.state_or_country_license_extra_information_document, title: props.t("Explanation document") })
                                                        }}>{props.t("View document")}</span>
                                                    } />
                                                </>
                                                :
                                                <RenderDetails label={props.t("Explanation about ID")} value={userDetail.state_or_country_license_extra_information_description || "-"} />
                                            } */}
                    </>
                    :
                    //Requester details
                    userDetail.temp_role_id === 2 ?
                      <>
                        {/* Company Information  */}
                        <RenderHeading heading={props.t("Company Information")} />
                        <div className="mt-13">
                          <RenderDetails label={props.t("Company name")} value={commonMethods.ConvertToCamelCase(userDetail.company_data[0]?.poc_name || "-")} />
                        </div>
                        <RenderDetails label={props.t("Primary contact")} value={userDetail.company_data[0]?.primary_contact_name || "-"} />
                        <RenderDetails label={props.t("Primary contact") + " " + props.t("telephone number")} value={userDetail.company_data[0]?.primary_contact || "-"} />
                        {
                          userDetail.company_data[0]?.alternative_contact_name ?
                            <RenderDetails label={props.t("Alternative contact")} value={userDetail.company_data[0]?.alternative_contact_name || "-"} />
                            :
                            ""
                        }
                        {
                          userDetail.company_data[0]?.alternative_contact ?
                            <RenderDetails label={props.t("Alternative contact") + " " + props.t("telephone number")} value={userDetail.company_data[0]?.alternative_contact || "-"} />
                            :
                            ""
                        }
                        <RenderDetails label={props.t("Company Street Address")} value={commonMethods.ConvertToCamelCase(userDetail.company_data[0]?.address || "-")} />
                        <RenderDetails label={props.t("Company City")} value={commonMethods.ConvertToCamelCase(userDetail.company_data[0]?.city || "-")} />
                        <RenderDetails label={props.t("Company State")} value={commonMethods.ConvertToCamelCase(userDetail.company_data[0]?.state || "-")} />
                        <RenderDetails label={props.t("Company Zip Code")} value={userDetail.company_data[0]?.zipcode || "-"} />
                        <RenderDetails label={props.t("Company Telephone Number")} value={userDetail.company_data[0]?.telephone_no || "-"} />
                        <RenderDetails label={props.t("Company Website")} value={userDetail.company_data[0]?.website || "-"} />
                        {/*
                                            According to change on 17/06/2021
                                            {userDetail.company_data[0]?.tax_id ? <RenderDetails label={props.t("Company Tax id")} value={userDetail.company_data[0]?.tax_id || "-"} /> : ""} */}

                        <RenderDetails label={props.t("Email")} value={userDetail.company_data[0]?.company_email || "-"} />
                        {userDetail.company_data[0]?.company_alternate_email ? <RenderDetails label={props.t("Alternative Email Address")} value={userDetail.company_data[0]?.company_alternate_email || "-"} /> : ""}
                        <RenderDetails label={props.t("Preferred language")} value={userDetail.company_data[0]?.preffered_language ? (userDetail.company_data[0].preffered_language.split(",")).join(", ") : "-"} />
                        {userDetail.company_data[0]?.photo ?
                          <RenderDetails label={props.t("Company photo")} value={
                            <span className="color-sidebar td-underline cur-point" onClick={() => {
                              setContentToPreview({ visibility: userDetail.company_data[0]?.photo, title: props.t("Company photo") })
                            }}>{props.t("View document")}</span>
                          } />
                          : ""
                        }
                        {/* <--> explanation abouyt company info - milestone 4 changes */}
                        {/* {userDetail.company_data[0]?.company_extra_information ?
                                                <>
                                                    <RenderDetails label={props.t("Additional company information")} value={
                                                        <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                            setContentToPreview({ visibility: userDetail.company_data[0]?.company_extra_information_document, title: props.t("Explanation document") })
                                                        }}>{props.t("View document")}</span>
                                                    } />
                                                </>
                                                :
                                                <RenderDetails label={props.t("Additional company information")} value={userDetail.company_data[0]?.company_extra_information_description || "-"} />
                                            } */}

                        {/* Due diligence */}
                        <RenderHeading heading={props.t("Due Diligence")} />
                        <div className="mt-13">
                          <RenderDetails label={props.t("Due Diligence Tax Id")} value={userDetail.tax_id || "-"} />
                        </div>
                        {userDetail.dun_and_bradstreet ? <RenderDetails label={props.t("Dun & breadsheet")} value={userDetail.dun_and_bradstreet} /> : ""}
                        <RenderDetails label={props.t("Corporate Structure")} value={userDetail.corporate_structure || "-"} />
                        <RenderDetails label={props.t("Years In Business")} value={userDetail.years_in_business || "-"} />
                        <RenderDetails label={props.t("Number Of Employees")} value={userDetail.number_of_employees || "-"} />


                        {/* milestone 4 chnages */}
                        {/* {userDetail.due_diligence_extra_information ?
                                                <RenderDetails label={props.t("Due diligence extra information")} value={
                                                    <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                        setContentToPreview({ visibility: userDetail.due_diligence_extra_information_document, title: props.t("Due diligence extra information") })
                                                    }}>{props.t("View document")}</span>
                                                } />
                                                :
                                                <RenderDetails label={props.t("Due diligence extra information")} value={userDetail.due_diligence_description || "-"} />
                                            } */}

                        <RenderDetails label={props.t("Corporate Criminal Offence")}
                          value={
                            userDetail.criminal_offenses === 0 ?
                              <span className="color-red">{props.t("No")}</span> :
                              userDetail.criminal_offenses === 1 ? <span className="color-green">{props.t("Yes")}</span> : "-"
                          }
                        />

                        {userDetail.criminal_offenses ? <RenderDetails label={props.t("Corporate Criminal Offence Description")} value={userDetail.criminal_offenses_explaination || "-"} /> : ""}

                        <RenderDetails label={props.t("Corporate Criminal Offense Supporting Document")} value={
                          userDetail.criminal_offenses_document ?
                            <span className="color-sidebar td-underline cur-point" onClick={() => {
                              setContentToPreview({ visibility: userDetail.criminal_offenses_document, title: props.t("Corporate criminal offense supporting document") })
                            }}>{props.t("View document")}</span>
                            : "-"
                        } />


                        {/* Insurance information */}
                        <RenderHeading heading={props.t("Insurance Information")} />
                        <div className="mt-13">
                          <RenderDetails label={props.t("Purchase Insurance")}
                            value={
                              userDetail.purchase_insurance === 0 ?
                                <span className="color-red">{props.t("No")}</span> :
                                userDetail.purchase_insurance === 1 ? <span className="color-green">{props.t("Yes")}</span> : "-"
                            }
                          />
                        </div>
                        {
                          userDetail.insurance_photo ?
                            <RenderDetails label={props.t("Insurance Proof")} value={
                              <span className="color-sidebar td-underline cur-point" onClick={() => {
                                setContentToPreview({ visibility: userDetail.insurance_photo, title: props.t("Insurance proof") })
                              }}>{props.t("View document")}</span>
                            } />
                            : ""
                        }
                        {/* milestone 4 changes */}
                        {/* {userDetail.insurance_extra_information ?
                                                <RenderDetails label={props.t("Insurance extra information")} value={
                                                    <span className="color-sidebar td-underline cur-point" onClick={() => {
                                                        setContentToPreview({ visibility: userDetail.insurance_extra_information_document, title: props.t("Insurance extra information") })
                                                    }}>{props.t("View document")}</span>
                                                } />
                                                :
                                                <RenderDetails label={props.t("Insurance extra information")} value={userDetail.insurance_extra_information_description || "-"} />
                                            } */}
                      </>
                      :
                      <>
                        {/* Admin details */}
                        <RenderHeading heading={props.t("Personal Information")} />
                        <div className="mt-13">
                          <RenderDetails label={props.t("Name")} value={userDetail.user_name || "-"} />
                        </div>
                        <RenderDetails label={props.t("Email Address")} value={userDetail.email || "-"} />
                        <RenderDetails label={props.t("Phone Number")} value={userDetail.phone_no || "-"} />
                      </>
                }

                {/* "payPal details */}
                {/* {userDetail.temp_role_id > 1 && <>
                  <RenderHeading heading={props.t("Stripe Details")} />
                  <div className="mt-13">
                    <RenderDetails label={props.t("Stripe Email Id")} value={userDetail.paypal_email || "-"} />
                  </div>
                  <RenderDetails label={props.t("Stripe Mobile Number")} value={userDetail.paypal_mobile_no || "-"} />
                </>
                } */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        previewContent.visibility &&
        <DocumentPreview
          url={previewContent.visibility}
          status={previewContent.visibility}
          onClose={() => {
            setContentToPreview({ visibility: false, title: "" })
          }}
        >{previewContent.title}</DocumentPreview>
      }
    </>
  )
}

export default withNamespaces()(UserDetails)
