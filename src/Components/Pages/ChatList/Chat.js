import React, { useState, useEffect } from 'react'
import { Row, Col, Label, Card } from 'reactstrap'
// import PerfectScrollbar from 'react-perfect-scrollbar';

import { withNamespaces } from "react-i18next";
import { GetAllUsers } from '../../../Common/entity'
import { bindActionCreators } from 'redux'
import { crudAction } from '../../../Store/Actions'
import { commonActions } from '../../../Utils'
import { connect } from 'react-redux';
import db from '../../helpers/config'
import { Formik, ErrorMessage, Form } from 'formik'
import * as Yup from 'yup';
import Audio from './Audio'
// import JsFileDownloader from "js-file-downloader";
import { MessageBox } from 'react-chat-elements'
import AWS from 'aws-sdk';

import 'react-chat-elements/dist/main.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

AWS.config.update(
  {
    accessKeyId: process.env.REACT_APP_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  }
);
var s3 = new AWS.S3();


const initState = {
  provider: '',
  requester: ''
}
const validationSchema = Yup.object().shape({
  provider: Yup.string().required("Please select provider"),
  requester: Yup.string().required("Please select requester"),
})

function ChatList(props) {
  const [data, setData] = useState([])
  const [provider] = useState('')
  const [requester, setRequester] = useState('')
  const [scrollEl] = useState();


  useEffect(() => {
    props.actions.SetLoader(true);
    const payload = {
      "type": "getAllUsers",
      "user_type": 0,
      "status": -1,
    }
    props.actions.postAll(GetAllUsers, payload, "getAllUsers")
  }, [])

  const fetchData = async (requester, provider) => {
    props.actions.SetLoader(true);
    const userId = getChatId(requester, provider);
    const response = await db.collection('Conversation').doc(userId).collection('Messages').orderBy('createdAt', 'asc');
    response.get().then((querySnapshot) => {
      var docs = querySnapshot.docs.map(doc => doc.data());
      setData(docs);
      props.actions.SetLoader(false);
    });
  }

  const getChatId = (userId1, userId2) => {
    let requesterid = props.getAllUsers?.data?.find((i) => i.id == userId1).quick_blox_id
    let providerid = props.getAllUsers?.data?.find((i) => i.id == userId2).quick_blox_id
    setRequester(requesterid)
    if (requesterid.localeCompare(providerid) > 0) {
      return requesterid + "_" + providerid
    } else {
      return providerid + "_" + requesterid
    }
  }

  function download(url) {
    let urlArray = url.split("/")
    let bucket = 'ipsdocuments'
    const file_name = urlArray.splice(-1).toString();
    let key = `Requester/ChatFile/${file_name}`
    let params = { Bucket: bucket, Key: key }
    s3.getObject(params, (err, data) => {
      let blob = new Blob([data.Body], { type: data.ContentType });
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = file_name;
      link.click();
    })
  }

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = 100;
    }
  }, [scrollEl])


  return (
    <>
      <div className="chat-support-table-wrapper d-flex">
        <div className="col-md-12">
          <Formik
            initialValues={initState}
            validationSchema={validationSchema}
            validateOnChange
            validateOnBlur
            onSubmit={(values) => {
              fetchData(values.requester, values.provider)
            }}>

            {({ handleChange, handleBlur }) => (
              <Form>
                <Row className="mb-3 mt-3">
                  <Col lg="4">
                    <Label>Requester</Label>
                    <select className="form-control form-control-sm" onChange={handleChange} onBlur={handleBlur} name="requester">
                      <option value="" label="Selected Requester">select</option>
                      {props.getAllUsers?.data?.filter((i) => i.user_role_id == 2).map((i) =>
                        <option key={i.id} value={i.id}>{i.first_name + " " + i.last_name}</option>
                        )}
                    </select>
                    <ErrorMessage className="error" name="requester" component="div" />
                  </Col>
                  <Col lg="4">
                    <Label>Provider</Label>
                    <select className="form-control form-control-sm" onChange={handleChange} onBlur={handleBlur} name="provider">
                      <option value="" label="Selected Provider">select</option>
                      {props.getAllUsers?.data?.filter((i) => i.user_role_id == 3).map((i) =>
                        <option key={i.id} value={i.id}>{i.first_name + " " + i.last_name}</option>)}
                    </select>
                    <ErrorMessage className="error" name="provider" component="div" />
                  </Col>
                  <Col lg="4">
                    <button className="form-control btn btn-primary btn-sm " style={{ marginTop: "18px" }} type="submit">Search</button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="col-md-12">
        <div className="w-100 user-chat">
          <Card>
            <div>
              <div className="chat-conversation p-3" style={{border:"1px solid #232f3b4e",borderRadius:"4px"}}>
                <ul className="list-unstyled">
                  <div className="scrolling-area">
                    <div className="scrolling-element-inside">
                      {data && data.map((message) =>
                        <li key={"test_k" + message.createdAt} className={message.senderId === requester ? "right" : ""}>
                          <div className="conversation-list">
                            {message.type === 1 &&
                              <MessageBox
                                position={message.senderId === requester ? 'right' : 'left'}
                                type={'text'}
                                text={message.message}
                              />
                            }
                            {message.type === 2 &&
                              <MessageBox
                                position={message.senderId === requester ? 'right' : 'left'}
                                type={'photo'}
                                onDownload={() => download(message.message)}
                                data={{
                                  width: 250,
                                  height: 200,
                                  uri: message.message,
                                  status: {
                                    click: false,
                                    download: false,
                                    loading: 0,
                                  }
                                }} />
                            }

                            {message.type === 3 &&
                              <MessageBox
                                position={message.senderId === requester ? 'right' : 'left'}
                                type={'file'}
                                text={`${message.message.split("/").slice(-1).toString()}`}
                                onDownload={() => download(message.message)}
                                data={{
                                  size: message.fileSize,
                                  width: 250,
                                  height: 200,
                                  uri: message.message,
                                  status: {
                                    click: false,
                                    download: false,
                                    loading: 0,
                                  }
                                }} />
                            }
                            {message.type === 4 && <Audio file={message.message} />}
                          </div>
                        </li>)}

                      {data && !data.length && <center><h3>No message found.</h3> </center>}
                    </div>
                  </div>
                  {/* </PerfectScrollbar> */}
                </ul>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});
export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(ChatList));
