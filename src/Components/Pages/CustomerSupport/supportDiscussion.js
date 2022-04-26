import moment from 'moment'
import { connect } from "react-redux";
import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody } from "reactstrap";
import { commonMethods } from '../../../Utils';
import * as entity from '../../../Common/entity';
import JobDetails from '../Jobs/inCompleteJobDetails';
import { RenderDetails } from '../IPSUsers/UserDetails';
import { Back_arrow, send_message } from "../../../Assets/Images/web";
import * as actionTypes from '../../../Common/actionTypes';

function SupportDiscussion(props) {

  let textbox;
  const regExp = /[^a-zA-Z0-9!?'"-{}()\n ]/gm
  const { data, heading } = props
  const [msg, setMsg] = useState([])
  const [jobData, setJobData] = useState()
  const [dateTime, setDateTime] = useState([])
  const [confirmDialogVisibility, setConfirmDialogVisibility] = useState(false)


  // set job data
  useEffect(() => {
    if (props.jobDetailsVisibility) {
      setCommonJobDetails()
    }
    return () => {
      setJobData()
    }
  }, [props.jobDetailsVisibility])

  useEffect(() => {
    props.actions.SetNull({ payload: null, entity: "jobDetailsVisibility" })
    if (data.dispute_conversation) {
      const conversationIds = data.dispute_conversation.map(item => {
        if (item.is_viewed === 0)
          return item.id
      }).filter(item => item != null)
      if (conversationIds.length > 0) {
        const payload = {
          type: "setconversationViewed",
          flag: props.isDispute ? 1 : 0,
          idList: conversationIds
        }
        props.actions.postAll(entity.ResolveContactSupport, payload, "conversationViewed", false, false)
      }
    }
  }, [])

  // Resolve dispute or support query
  const ResolveHandler = () => {
    let allowResolve = data.dispute_conversation.some(item => {
      return item.is_add_by_admin === 1
    })

    if (msg.length > 0) {
      allowResolve = msg.some(item => {
        return item !== ""
      })
    }

    if (allowResolve) {
      let payload;
      if (heading.includes("Support")) {
        payload = {
          "type": "resolveContactSupport",
          "contact_support_id": data.id,
          "status": 1
        }
      }
      else {
        payload = {
          "type": "resolveDispute",
          "dispute_id": data.id,
          "status": 2
        }
      }
      props.actions.postAll(entity.ResolveContactSupport, payload, "Solved")
    }
    else {
      setConfirmDialogVisibility(false)
      props.actions.setredux("Please give response to the request before marking it as solved", 'error_message', actionTypes.ERROR_MESSAGE)
    }
  }

  // send msg into conversation
  const sendMessage = (a) => {
    let temp_str = a
    if (temp_str.length > 0) {
      if (heading.includes("Support")) {
        const payload = {
          "type": "sendContactSupportConversation",
          "c_s_id": data.id,
          "description": temp_str
        }
        props.actions.postAll(entity.ResolveContactSupport, payload, "msgSent", false, false)
      }
      else {
        const payload = {
          "type": "sendDisputeConversation",
          "dispute_id": data.id,
          "description": temp_str
        }
        props.actions.postAll(entity.ResolveContactSupport, payload, "msgSent", false, false)
      }
    }
    setDateTime([...dateTime, new Date()])
    document.getElementById("description").value = ""
  }

  const setCommonJobDetails = () => {
    if (props.jobDetailsVisibility.data?.job_filter_data[0]) {
      const Date1 = commonMethods.getSortedDate(props.jobDetailsVisibility.data.job_filter_data[0].job_schedule_time)
      const a = Object.assign({}, props.jobDetailsVisibility.data.job_filter_data[0], { date: moment(Date1[0]).format('MMM DD, YYYY') + props.t(" to ") + moment(Date1[Date1.length - 1]).format('MMM DD, YYYY') })
      setJobData(a)
    }
  }

  useEffect(() => {
    if (props.JobPayment) {
      GetJobDetails()
    }
  }, [props.JobPayment])

  // get job details @dispute chat
  const GetJobDetails = () => {
    const payload = {
      type: "getAllJobPostAdmin",
      job_id: "" + data.job_id
    }
    props.actions.postAll(entity.GetAllJobPostAdmin, payload, "jobDetailsVisibility")
  }

  const sendMsg = () => {
    let a = document.getElementById("description").value
    a = a.replace(regExp, '');
    if ((a.trim()).length > 0) {
      setMsg([...msg, a.trim()])
      sendMessage(a.trim())
      document.getElementById("description").value = ""
    }
    else {
      props.actions.setredux("Response can not be empty", 'error_message', actionTypes.ERROR_MESSAGE)
    }
  }

  const HitEnterToSendMessage = (e) => {

    var a = document.getElementById("description").value
    textbox.addEventListener("input", event => {
      a = a.replace(regExp, '');
    }, false);
    // document.getElementById("description").value = a

    textbox.addEventListener("paste", event => {
      a = a.replace(regExp, '');
    }, false);
    document.getElementById("description").value = a

    if (e.key === 'Enter' || e.keyCode === 13) {
      document.getElementById("description").value = a + "\n"
    }
  }

  return (
    <>
      {!jobData &&
        <>
          {/* Header */}
          {props.data &&
            <div className="input-group Heading-Wrapper-container support-discussion">
              <div className="Heading-Wrapper  w-100p ">
                <img src={Back_arrow} alt="back-arrow" className="back-arrow" onClick={() => {
                  props.actions.setredux(true, "backOnQueryTable")
                  props.onClose()
                }} />
                <span className="details-text">{heading.includes("Support") ? data.title : heading}</span>
                {data.status_temp !== 1 && <button className="btn-save add_button_new" onClick={() => {
                  // ResolveHandler()
                  setConfirmDialogVisibility(true)
                }}>{props.t("Resolve")}</button>}
              </div>
            </div>
          }

          {/* sender details */}
          <div className="order-detail-table-wrapper new-job-detail-table-wrapper user-detail-wrapper">
            <div className="job-requester-details">
              <div className="detail-wrapper ml-20 w-100p">
                <div className="job-overview-wrapper">
                  <div className="mr-30">
                    <RenderDetails label={props.t("Name")} value={data.first_name + " " + data.last_name} />
                    <RenderDetails label={props.t("Role")} value={data.user_type} />
                    <RenderDetails label={props.t("Date Of Query Generated")} value={data.received_date} />
                    {data.updatedAt ?
                      <RenderDetails label={props.t("Date of query resolved")} value={moment(data.updatedAt).format('MMMM DD, YYYY')} /> :
                      !heading.includes("Support") &&
                      <RenderDetails label={props.t("Job Details")} value={
                        <span className=" ml-4 color-sidebar td-underline cur-point" onClick={() => { GetJobDetails() }}>{props.t("View details")}</span>
                      } />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* message screen */}
          <Card className="p-r">
            <CardBody className="view-product-wrapper support-discussion ">
              <div style={{ height: '67vh', overflow: 'scroll', overflowX: 'hidden' }}>
                <table className="w-100p">
                  <tbody>
                    <>
                      {
                        data.dispute_conversation && data.dispute_conversation.map((item, index) => {
                          const temp_str = (item.description.replaceAll("`d", '"')).replaceAll('`', "'")
                          if (item.is_add_by_admin === 1) {
                            return <tr>
                              <p className="time-stamp">{moment(item.createdAt).format('MMM DD YYYY, hh:mm:ss a')}</p>
                              <div className="sent-message" style={{ clear: 'left' }} >
                                <span>{temp_str}</span>
                              </div>
                            </tr>
                          }
                          else {
                            return <tr>
                              <p className="time-stamp ta-left">{moment(item.createdAt).format('MMM DD YYYY, hh:mm:ss a')}</p>
                              <div className="received-message">
                                <div >
                                  <span>{temp_str}</span>
                                </div>
                              </div>
                            </tr>
                          }
                        })
                      }
                      {
                        msg.length > 0 && msg.map((item, index) => {
                          return <tr key={index}>
                            <p className="time-stamp">{moment(dateTime[index]).format('MMM DD YYYY, hh:mm:ss a')}</p>
                            <div className="sent-message" style={{ clear: 'left' }}>
                              <div style={{ float: 'right' }}>
                                <span>{item}</span>
                              </div>
                            </div>
                          </tr>
                        })
                      }
                    </>
                  </tbody>
                </table>
              </div>
            </CardBody>

            {/* input message */}
            {data.status_temp !== 1 &&
              <div className="message-input p-a b-0 w-100p d-flex" style={{ clear: 'left', bottom: '-58px' }} >
                <textarea
                  type="textarea" name="description" id="description"
                  style={{ width: "94%" }}
                  placeholder={props.t("Enter Response")}
                  autoComplete="off"
                  tabIndex={-1}
                  ref={element => textbox = element}
                  className="form-control"
                  validate={{ required: { value: true } }}
                  onChange={(e) => {
                    let temp = document.getElementById("description").value
                    temp = temp.replace(regExp, '');
                    document.getElementById("description").value = temp
                  }}
                  onKeyDown={(e) => {
                    HitEnterToSendMessage(e)
                  }}
                >
                </textarea>
                <img src={send_message} alt="send_message" className="cur-point send-message" onClick={() => {
                  sendMsg()
                }} />
              </div>
            }
          </Card>
        </>
      }

      {/* open job details from dispute */}
      {
        jobData &&
        <JobDetails
          jobdetails={jobData}
          onClose={() => {
            // props.actions.setredux(false, "jobDetailsVisibility")
            setJobData();
          }}
          PaymentMode={props.paymentMode}
          Status={props.status}
          actions={props.actions}
          StatusColorCode={props.statusColorCode}
          PaymentColorCode={props.paymentColorCode}
        />
      }

      {
        confirmDialogVisibility &&
        <div id="create-course-form" className="needs-validation">
          <commonMethods.RenderSweetAlert
            onCancel={() => setConfirmDialogVisibility(false)}
            CustomButton={
              <>
                <Button className="cancel-button mr-4" onClick={() => {
                  setConfirmDialogVisibility(false)
                }}>{props.t("No")}</Button>
                <Button className="add-button" onClick={() => {
                  ResolveHandler()
                }}>{props.t("Yes")}</Button>
              </>
            }
            Body={() => (
              <>
                <span className="sf-pro-text resolve-text" >
                  {props.t("Are you sure you want to resolve the case?")}
                </span>
              </>
            )}
          />
        </div>

      }
    </>
  )
}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
}

export default connect(mapStateToProps, null)(SupportDiscussion);
