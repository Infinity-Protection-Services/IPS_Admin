import React, { useState, useEffect } from "react";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import moment from 'moment'

import { Back_arrow } from "../../../Assets/Images/web";
import { commonMethods } from '../../../Utils'

function OrderDetails(props) {

  const { orderDeatil } = props
  const [data, setData] = useState({ columns: [], rows: [] });
  const [userPhoto, setUserPhoto] = useState();

  // set table heading
  useEffect(() => {
    setData({
      ...data,
      columns: [
        { label: props.t("No"), field: "index", className: "Id", },
        { label: props.t("Image"), field: "image1", sort: 'disabled'},
        { label: props.t("Title"), field: "title", sort: 'disabled'},
        { label: props.t("Date"), field: "date", },
        { label: props.t("Price"), field: "price", sort: 'disabled'},
        { label: props.t("Quantity"), field: "qty", sort: 'disabled'},
        { label: props.t("Size"), field: "size", sort: 'disabled'},
        { label: props.t("Total"), field: "total_amt", sort: 'disabled'},
      ]
    })
  }, [props.t])

  // set Details to Row
  useEffect(() => {

    setUserPhoto(commonMethods.setImages(orderDeatil.photo))
    setData({
      ...data,
      rows: orderDeatil.order_item_data.map((item, index) => {
        item['index'] = index + 1
        item['image1'] = <img className="order-item-image" src={item.image} alt="order-item" />;
        item['date'] = moment(item.createdAt).format('MMM DD, YYYY');
        item['total_amt'] = '$' + String(item.total_amt).match(/\d/g).join("");
        item['price'] = '$' + String(item.price).match(/\d/g).join("");
        item['qty'] = item.qty < 10 ? "0" + item.qty : item.qty
        return item
      })
    })
  }, [])

  return (
    <>
      {/* Header */}
      <div className="input-group Heading-Wrapper-container">
        <div className="form-outline Heading-Wrapper">
          <img src={Back_arrow} className="back-arrow" alt="back-arrow" onClick={props.onClose} />
          <span className="details-text">{props.t("Order Details")}</span>
        </div>
      </div>

      {/* Content */}
      <div className="order-detail-table-wrapper" >
        {/* User Deatils */}
        <div className="personal-detail">
          <img className="name-image" src={userPhoto} alt="name" loading="lazy" />
          <div className="ml-20 detail-wrapper">
            <span className="person-name">{commonMethods.ConvertToCamelCase(orderDeatil.first_name + " " + orderDeatil.last_name)}</span>
            <div className="person-contact-wrapper">
              <div>
                <div className="detail mr-15">{props.t("Email")}</div>
                <div className="mt-13 mr-15 detail">{props.t("Address")}</div>
                <div className="mt-13 detail mr-15">{props.t("Phone No")}</div>
              </div>

              <div>
                <div className="label">: {orderDeatil.email}</div>
                <div className="mt-13 label">: {orderDeatil.address}</div>
                <div className="mt-13 label">: {orderDeatil.phone_no}</div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="customer-support-table-wrapper-new mt-40 space-between" >
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No Orders Data Found!")}</div>}
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={data}
            searching={false}
            displayEntries={true}

          />

        </div> */}

          <div className="customer-support-table-wrapper-new">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No timeSheet data found!")}</div>}
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={data}
            searching={false}
            displayEntries={false}
          />
        </div>
      </div>
    </>
  );
}

export default withNamespaces()(OrderDetails);
