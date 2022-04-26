import React, { useState } from "react";
import { withNamespaces } from "react-i18next";

import { Card, CardBody, CardTitle } from "reactstrap";
import { DropDown } from "../../../Utils/commonMethods";

function Users(props) {
  const [drop_align, setdrop_align] = useState(false);
  return (
    <React.Fragment>
      <Card style={{ height: '92%' }}>
        <CardBody className="p-0">
          <CardTitle className="mb-4">{props.t("Users")}</CardTitle>
          <div className="table-responsive mt-4 dashboard-users">
            <DropDown
              open={drop_align}
              onClose={() => setdrop_align(!drop_align)}
              pa="p-a"
              onSelect={(id) => { }}
              options={[{ a: "a" }, { a: "b" }]}
            />

            <table className="table table-centered table-nowrap mb-2">
              <tbody className="p-r">
                <tr>
                  <td style={{ width: "40%" }}><p className="mb-0">{props.t("All Users")}</p></td>
                  <td style={{ width: "20%" }}><h5 className="mb-0 dashboard-users">1,456</h5></td>
                </tr>
                <tr>
                  <td><p className="mb-0">{props.t("Bounced Session")}</p></td>
                  <td><h5 className="mb-0 dashboard-users ">1,123</h5></td>
                </tr>
                <tr>
                  <td><p className="mb-0">{props.t("Direct Traffic")}</p></td>
                  <td><h5 className="mb-0 dashboard-users">1,026</h5></td>
                </tr>
              </tbody>
              <div className="view-all-users">
                {props.t("View all")}
              </div>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default withNamespaces()(Users);
