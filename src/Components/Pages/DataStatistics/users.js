import React, { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { DropDown } from "../../../Utils/commonMethods";

function Users(props) {
  const [drop_align, setdrop_align] = useState(false);
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Users</CardTitle>
          <div className="table-responsive mt-4">
            <DropDown
              open={drop_align}
              onClose={() => setdrop_align(!drop_align)}
              pa="p-a"
            />

            <table className="table table-centered table-nowrap mb-2">
              <tbody>
                <tr>
                  <td style={{ width: "40%" }}>
                    <p className="mb-0">All Users</p>
                  </td>
                  <td style={{ width: "20%" }}>
                    <h5 className="mb-0">1,456</h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mb-0">Bounced Session</p>
                  </td>
                  <td>
                    <h5 className="mb-0">1,123</h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mb-0">Direct Traffic</p>
                  </td>
                  <td>
                    <h5 className="mb-0">1,026</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default Users;
