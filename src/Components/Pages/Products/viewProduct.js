import React, { useState, useEffect } from "react";
import { withNamespaces } from "react-i18next";
import { Row, Card, CardBody, FormGroup, Label } from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import download_file from "../../../Assets/Images/web/download_file.svg";


function ViewProduct(props) {
  const [data, setData] = useState(props.data)
  const [sizeChartVisibility, setSizeChartVisibility] = useState(false)

  // Set Product data
  useEffect(() => {
    setData({
      ...data,
      size: data.size.split(','),
      stock: data.stock.split(",")
    })
  }, [])

  return (
    <React.Fragment>
      <Card>
        <CardBody className="view-product-wrapper">
          {!sizeChartVisibility && <AvForm className="needs-validation">
            {/* Product Image */}
            <Row>
              <FormGroup>
                <div className="row">
                  {(data.images.split(",")).map((item, index) => {
                    return <div id="photo-squre" className="squre mr-2 mt-2" key={index}>
                      <img src={item} alt={index} />
                    </div>
                  })}
                </div>
              </FormGroup>
            </Row>

            {/* Product Name */}
            <Row>
              <h4>{data.title}</h4>
            </Row>

            {/* Price & Size Stocks */}
            <div className="order-detail-table-wrapper">
              <div className="person-contact-wrapper">
                {/* Price */}
                <div>
                  <div className="detail">{props.t("Price")}</div><br />
                  <div className="detail">{props.t("Size & Stocks")}</div>
                </div>

                {/* Size & Stocks */}
                <div className="view-price-stock-container">
                  <div className="desc">: {data.price}</div><br />
                  <div className="mt-13 detail">
                    :
                    <>
                      <div className="ml-5" style={{ width: '100px' }}>
                        <span>{props.t("Size")}</span>
                      </div>
                      <div className="size-stock">
                        <span>{props.t("Stock")}</span>
                      </div>
                    </>
                  </div>
                  {typeof (data.size) !== 'string' && data.size.map((item, id) => {
                    return <div className=" detail size-stock-detail ml-10" key={id}>
                      <div className="sf-pro-text" style={{ width: '100px' }}>
                        <span>
                          {data.size[id] === "none" ||
                            data.size[id] === "NONE"
                            ? "-"
                            : data.size[id]}
                        </span>
                      </div>
                      <div className="size-stock sf-pro-text">
                        <span className="w-200p">{data.stock[id]}</span>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            </div>
            <br />
            {/* Description */}
            <div>
              <div className="label" style={{ color: "#000000" }}>
                {props.t("Description")} <div className="desc" style={{ marginTop: "-20px", marginLeft: "7rem" }}>: {data.description}
                </div>
              </div>
            </div>
            <br />
            {/* Size Chart */}
            <div>

              <a className="cur-point lbl-color" href onClick={() => {
                setSizeChartVisibility(true)
              }}><img src={download_file} className="pr-3 cur-point p-a left-75 cur-point w-35"
                />{props.t("Size Chart")}</a>
            </div>


          </AvForm>
          }
          {sizeChartVisibility &&
            <div className="d-grid p-r justify-item-center">
              <i className="fa fa-times p-a l-0 cur-point" aria-hidden="true" onClick={() => {
                setSizeChartVisibility(false)
              }}></i>
              <img src={data.size_chart + "?" + Date.parse(new Date())} alt='size-chart' className="mt-25 view-size-chart" />
            </div>
          }
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default withNamespaces()(ViewProduct);
