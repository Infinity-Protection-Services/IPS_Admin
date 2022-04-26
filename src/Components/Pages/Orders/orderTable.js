import React, { useState, useEffect } from "react";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from 'moment';
import OrderDetails from "./orderDetails";
import { crudAction } from "../../../Store/Actions";
import { commonActions, commonMethods } from "../../../Utils";
import * as entity from '../../../Common/entity';

let customSort = { type: '', data: null };

function OrderTable(props) {
  const [dataForSorting, setDataforSorting] = useState()
  const [data, setData] = useState({ columns: [], rows: [] })

  // set Order data to table
  useEffect(() => {
    props.GetOrderList && setDataforSorting(props.GetOrderList)
    if (props.GetOrderList !== undefined && props.GetOrderList) {
      const status = [props.t("Mark as Shipped"), props.t("Shipped"), props.t("Delivered")]
      const statusColorCode = ['#0D5EA4', '#EA7715', '#02BE1B']
      const TempOrderArray = props.GetOrderList.map(item => {
        item.status = [0, status[0]].includes(typeof item.status === "string" ? props.t(item.status) : item.status)
          ? status[0]
          : [1, status[1]].includes(typeof item.status === "string" ? props.t(item.status) : item.status)
            ? status[1]
            : [2, status[2]].includes(typeof item.status === "string" ? props.t(item.status) : item.status)
              ? status[2]
              : ''
        return item
      })
      setData({
        ...data,
        rows: TempOrderArray.map((item, index) => {
          const sendItemToDetails = item;
          item['id'] = item.order_id
          item['names'] = <>
            <div className="image-name-wrapper" onClick={() => { props.actions.setredux(sendItemToDetails, "orderDetailVisibility"); }}>
              <img className="name-image" alt="person" src={commonMethods.setImages(item.photo)} />
              <span>{commonMethods.ConvertToCamelCase(item.first_name + " " + item.last_name)}</span>
            </div>
          </>
          item['order_status'] = <>
            <div style={{ color: item.status === status[0] ? statusColorCode[0] : item.status === status[1] ? statusColorCode[1] : item.status === status[2] ? statusColorCode[1] : '' }}>
              {item.status === status[0] ?
                <commonMethods.OrderStatus
                  MarkAsShipped={status[0]}
                  id={index}
                  message={props.t("Click to mark as shipped")}
                  onClick={() => MarkAsShippedHandler(item)} /> :
                item.status === status[1] ?
                  status[1] :
                  item.status === status[2] ?
                    status[2] :
                    ''
              }
            </div>
          </>;
          item['date'] = moment(item.createdAt).format('MMM DD, YYYY');
          item['total_qty'] = String(item.total_qty).length === 1 ? "0" + item.total_qty : item.total_qty
          item['total_amount'] = item.total_amount ? "$" + String(item.total_amount).match(/\d/g).join("") : '-';
          item['order_item_data'] = item.order_item_data.map(item => {
            item.title = item.title && (item.title.replaceAll("`d", '"')).replaceAll('`', "'")
            return item
          })
          return item
        })
      })
    }
    else {
      setData({
        ...data,
        rows: []
      })
    }
  }, [props.GetOrderList, props.t])

  // set table heading
  useEffect(() => {
    setData({
      ...data,
      columns: [
        { label: <span className="d-block">{props.t("No")}</span>, field: "id", },
        // {
        //   label: <span onClick={() => {
        //     sortHandler("first_name");
        //     if (customSort.type === "nameAscendingSort") { customSort.type = 'nameDescendingSort' }
        //     else { customSort.type = "nameAscendingSort" }
        //   }} className="cur-point ml-10 p-r t-2" > {props.t("Name")}
        //     <ArrowUpwardIcon className={customSort.type === "nameAscendingSort" ? "up-arrow color ml-4" : "up-arrow ml-4"} />

        //     <ArrowDownwardIcon className={customSort.type === "nameDescendingSort" ? "down-arrow color" : "down-arrow"} />
        //   </span>
        //   , field: "name1", sort: "disabled",
        // },

        { label: props.t("Name"), field: "names", },
        { label: props.t("Address"), field: "address",  sort: 'disabled'},
        { label: props.t("Date"), field: "date", },
        { label: props.t("Quantity"), field: "total_qty", sort: 'disabled' },
        { label: props.t("Total"), field: "total_amount", sort: 'disabled' },
        // {
        //   label: <span
        //     onClick={() => {
        //       sortHandler("status");
        //       if (customSort.type === "statusAscendingSort") { customSort.type = 'statusDescendingSort' }
        //       else { customSort.type = "statusAscendingSort" }
        //     }}
        //     className="cur-point p-r t-2">
        //     {props.t("Status")}
        //     <ArrowUpwardIcon className={customSort.type === "statusAscendingSort" ? "up-arrow color ml-4" : "up-arrow ml-4"} />
        //     <ArrowDownwardIcon className={customSort.type === "statusDescendingSort" ? "down-arrow color" : "down-arrow"} />
        //   </span>,
        //   field: "order_status",
        //   sort: "disabled"
        // },
        { label: props.t("Status"), field: "order_status", sort: "disabled" },
      ],
    })
  }, [props.t, customSort.type])

  useEffect(() => {
    customSort = { ...customSort, data: dataForSorting }
  }, [dataForSorting])

  // API call GetOrderList
  useEffect(() => {
    const payload = {
      order_search: "",
      type: "getAllOrdersAdmin"
    }
    props.actions.postAll(entity.GetAllOrders, payload, "GetOrderList")
  }, [props.MarkAsShipped])

  const MarkAsShippedHandler = (value) => {
    const paylaod = {
      user_id: value.user,
      "type": "markOrderAsShipped",
      "order_id": value.order_id
    }
    props.actions.postAll(entity.MarkOrderAsShipped, paylaod, "MarkAsShipped")
  }

  async function sortHandler(field) {
    await props.actions.SetData({ type: "FETCH", payload: null, entity: "GetOrderList" })
    const sorted = customSort.data && commonMethods.SortData({ value: customSort.data, type: customSort.type, field: field })
    await props.actions.SetData({ type: "FETCH", payload: sorted, entity: "GetOrderList" })
  }

  return (
    <>
      {!props.orderDetailVisibility && (
        <>
          <div className="input-group serach-wrapper-container">
            <div className="form-outline search-wrapper col-md-8">
              {/* <input type="text" placeholder={props.t("Search Order Here")} className="form-control search" autoComplete="off" />  */}
              {/* onChange={SearchOnChangeHandler} */}
              {/* <img src={Search} className="search-image" alt={props.t("Search")} /> */}
            </div>
          </div>

          <div className="customer-support-table-wrapper-new common-wrapper order-table p-r" >
            <MDBDataTable
              noBottomColumns={true}
              noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No orders found!")}</div>}
              paginationLabel={[<MDBIcon icon="angle-left" size="sm" />, <MDBIcon icon="angle-right" size="sm" />,]}
              info={false}
              responsive
              bordered
              data={data}
              hover
              entriesOptions={props.entryOptions}
              displayEntries={true}
            />
            <br/>
            Showing 1 to 10 of {data.rows.length} entries.
          </div>
        </>
      )
      }
      {
        props.orderDetailVisibility && (
          <OrderDetails
            orderDeatil={props.orderDetailVisibility}
            onClose={() => { props.actions.setredux(false, "orderDetailVisibility"); }}
          />
        )
      }
    </>
  );

}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(OrderTable));
