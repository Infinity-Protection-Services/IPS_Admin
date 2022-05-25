import React from "react";

const Login = (
  <div className="ta-left p-text">
    <p>
    To access the Admin Panel, the Admin will be required to sign in from the “Sign in” screen
    </p>

    <ul>
      <li>
      Enter valid login credential and click on the “Sign in” button to proceed. If there is a mistake in entering credentials, you will get notified
      </li>
      &nbsp;
      <li>
      Check on “Remember me” to avoid entering credentials every time you login
      </li>
      &nbsp;
      <li>
      After successful login, you will be redirected to the Dashboard screen
      </li>
    </ul>
  </div>
);

const Users = (
  <div className="ta-left p-text">
    <p>On the Users screen, you will be able to see all Users with a filter.</p>
    <ul>
      <li>
        All Active Users can be tracked with filters shown on the top left
        corner
      </li>
      &nbsp;
      <ul>
        <li>All Users</li>
        &nbsp;
        <li>Provider</li>
        &nbsp;
        <li>Requester</li>
        &nbsp;
        <li>View more data using pagination at the right bottom corner</li>
        &nbsp;
        <li>
          Click on “View Details” to see more details about Requester and
          Provider respectively
        </li>
        &nbsp;
        <li>Sort columns by clicking on names in the header</li>
      </ul>
      &nbsp;
      <ul>
        <li>After clicking on “View Details”, scroll down for more details</li>
      </ul>
      &nbsp;
      <ul>
        <li>Click on “View document” to see uploaded document(s)</li>
      </ul>
    </ul>
  </div>
);

const NewJobs = (
  <div className="ta-left p-text">
    <p>
      There are 3 job categories: New Jobs, In-Progress Jobs, Completed Jobs.
    </p>
    <ul>
      <li>
        New Jobs: in this section all newly created jobs will appear that are
        not assigned to any Provider.
      </li>
      &nbsp;
      <li>
        Admin can see the total job requests received for a particular job in
        the New Jobs module.
      </li>
      &nbsp;
      <li>
        Admin will be able to see Payment and Work History along with important
        details regarding Job, Provider and Requester data.
      </li>
      &nbsp;
      <li>Click on “View Details” to view Job Details</li>&nbsp;
      <li>Displays Job data, Job Request data and Timesheet data.</li>&nbsp;
      <li>In the job data table, the Requester edits the job so the data is displayed.</li>&nbsp;
      <li>Requester can add Provider in edit job so that Provider details display in Job Requests table.</li>&nbsp;
      <li>Provider can select shift box so that shift box information displays in Timesheet table.</li>&nbsp;
    </ul>
    <h2><center><b>Edit New Jobs</b></center></h2>&nbsp;
    <p><b>Tab 1:</b> Edit the job in New Jobs details to display the Job Details tab.</p>
    <ul>
    <li>In this tab you can edit Title, Expertise/Skill and Description</li>&nbsp;
    <li>Requester can auto assign job if checkbox is selected</li>&nbsp;
    <li>Click on Next button to save Job Details data</li>&nbsp;</ul>

    <p><b>Tab 2:</b> In the Edit job, it will display Location details</p>
    <ul>
    <li>Requester search any place location and select any location so that location data auto fills in location details, Street Address, City, State, Zip Code</li>&nbsp;
    <li>In visibility field dropdown IPS User and Requester User option displays in this field</li>&nbsp;
    <li>If the User selects IPS User, it could search any Provider after selecting any Provider open pop up and this pop up display shift boxes so user selected multiple shift boxes</li>&nbsp;
    <li>If the User selects a Requester User, it can add any Provider</li>&nbsp;
    <li>Requester can also change visibility</li>&nbsp;
    <li>Backup Provider field optional so Requester can add Backup Provider or not</li>&nbsp;</ul>


    <p><b>Tab 3:</b> In the Edit job, it will display Pricing Details</p>
    <ul>
    <li>Requester can select any Experience Level, State, Provider Type and change Rate Per Hour</li>&nbsp;
    <li>Requester can add number of Providers and update Recommended Rate</li>&nbsp;
    <li>+ Add More option to Requester can add shift box but if total number of Provider display Requester only those number of shift box added</li>&nbsp;
    <li>Requester can add Start Date, End Date, Start Time, End Time and days so that  calculation is handled by Recommended Rate</li>&nbsp;
    <li>Requester can also remove the shift box</li>&nbsp;
    </ul>
  </div>
);

const InProgressJob = (
  <div className="ta-left p-text">
    <ul>
      <li>
        In-Progress: once a job is assigned to the Provider it moves to the
        In-Progress section. Here the Admin can see Payment History and Job
        Duration
      </li>
      &nbsp;
      <li>
        Admin can Pay and Refund for In-Progress Jobs as partial payments or
        full payment
      </li>
      &nbsp;
      <li>
        Pay Provider: Amount will be given to Admin after deduction of the
        commission at the time the job was created. Admin is authorized to make
        changes in the amount of payment
      </li>
      &nbsp;
      <li>
        Refund Requester: Admin can refund amount to Requester by clicking
        “Refund’ on top. If the Requester requests a refund for any reason and
        the amount received by the Requester is not fully paid to the Provider,
        a refund will be initiated. Admin can enter the amount to be refunded.
        It should not be greater than the refundable amount
      </li>
      &nbsp;
      <li>
        If the Admin has paid the full amount to the Provider, no refund amount
        is shown
      </li>
      &nbsp;
      <li>
        See below: Admin has paid the full amount to the Provider, so no refund
        to the Requester is applicable
      </li>
      &nbsp;
      <li>
        Payment History displays the Total Transactions (Amount Paid, Amount
        Received, Amount Refunded)
      </li>&nbsp;
      <li>Job Request history displays only those Providers that accept the request and if Provider type is backup the Backup Provider will not be paid. </li>&nbsp;
      <li>Clock-in and Clock-out history data are only backup Provider Clock-in and Clock-out in a job.</li>&nbsp;
      <li>Provider select shift box so that shift box information displays in Timesheet table.</li>&nbsp;
      <li>Payment history displays the total transitions that happened (Amount Paid, Amount Received, Amount Refunded with all necessary details).</li>&nbsp;
    </ul>
    <h2><center><b>Edit In-Progress Jobs</b></center></h2>&nbsp;
    <p><b>Tab 1:</b> Edit the job in In-Progress Jobs details, it will display the Job Details tab</p>
    <ul>
    <li>In this tab you can edit Title, Expertise/Skill and Description</li>&nbsp;
    <li>Requester can auto assign job if checkbox is selected</li>&nbsp;
    <li>Click on the Next button to save Job Details data</li>&nbsp;</ul>

    <p><b>Tab 2:</b> In the Edit job, you will display location details</p>
    <ul>
    <li>Requester can search any location and select any location so that location data auto fills in Location details, Street Address, City, State, Zip Code</li>&nbsp;
    <li>In-Progress job visibility field disable</li>&nbsp;
    <li>If an IPS User or Requester User, it could search any Provider after selecting any Provider open pop up and this pop up display shift boxes so the user selected only one shift box</li>&nbsp;
    <li>Backup Provider field optional so Requester can add Backup Provider if needed</li>&nbsp;
    </ul>

    <p><b>Tab 3:</b> In the Edit job, you will display Pricing details</p>
    <ul>
    <li>Requester should not change experience level, State, Provider Type, Rate Per Hour, number of Providers and Recommended Rate</li>&nbsp;
    <li>+ Add More option to Requester can add shift box but if total number of Provider display Requester only those number of shift box added</li>&nbsp;
    <li>Requester can add Start Date, End Date, Start Time, End Time and days so the  calculation will handle the Recommended Rate</li>&nbsp;
    <li>Requester should not remove shift box in In-Progress job</li>&nbsp;
    </ul>
  </div>
);

const CompletedJobs = (
  <div className="ta-left p-text">
    <ul>
      <li>once the job is completed, it will move to Completed Jobs section</li>&nbsp;
      <li>
        Admin can Pay and Refund for Complete Jobs as partial payments or full
        payment
      </li>
      &nbsp;
      <li>
        Pay Provider: Amount will be given to Admin after deduction of the
        commission at the time the job was created. Admin is authorized to make
        changes in the amount of payment
      </li>
      &nbsp;
      <li>
        Refund Requester: Admin can refund amount to Requester by clicking
        “Refund’ on top. If the Requester requests a refund for any reason and
        the amount received by the Requester is not fully paid to the Provider,
        a refund will be initiated. Admin can enter the amount to be refunded.
        It should not be greater than the refundable amount
      </li>
      &nbsp;
      <li>
        If the Admin has paid the full amount to the Provider, no refund amount
        is shown
      </li>
      &nbsp;
      <li>Scroll down to see more information</li>&nbsp;
      <li>
        In the Payment History table, scroll horizontally to show hidden details
      </li>
      &nbsp;
      <li>
        Confirm Payment: when Admin clicks on “Yes” the amount will be
        transferred from the Admin Stripe account to the Provider’s Stripe
        account
      </li>
      &nbsp;
      <li>
        When refunding the amount to Requester, Admin will enter the amount in
        the dialog then hit “Refund” to proceed
      </li>
    </ul>
  </div>
);

const Payment = (
  <div className="ta-left p-text">
    <p>
      In the Payment Module, you will receive data of payments due and refunds
      on the respective screen.
    </p>
    <ul>
      <li>
        The first screen on “Payment”, has all the records of the job which has
        payment_type = “Pay by hour”. On the details page, it contains necessary
        details of Job, Requester, and Provider with previous payment history.
        Click on the “Pay now” link on Payable amount and verify your amount in
        the opened pop-up. Admin can change the amount s/he wishes to pay and
        click on “Pay”
      </li>
      &nbsp;
      <li>
        On the “Refund” screen, the Admin will receive all refunds that need to
        be done to the Requester and in the detail screen, there are necessary
        details of Job, Requester, and Provider with previous payment history.
        Click on the green “Refund” button, to refund the amount, do a partial
        refund by changing the amount.
      </li>
      &nbsp;
      <li>You can find Users by using the search functionality.</li>&nbsp;
      <li>You can sort columns by clicking on names in the header.</li>
      &nbsp;
      <li>
        Scroll down to see more details on the Payment Details screen below
      </li>
      &nbsp;
      <li>Confirm Payable Amount in dialog box below</li>
      &nbsp;
      <li>
        Refund Data is calculated if the Requester has paid an amount greater
        than recommended rate. If the Requester removes one day from the job on
        request of Provider, the remaining amount will be refunded and can be
        done from this screen
      </li>
    </ul>
  </div>
);

const Category = (
  <div className="ta-left p-text">
    <p>
      Categories that will be displayed on the Requester platform, will be
      created here
    </p>
    <ul>
      <li>
        Introduce a new Category by clicking on the “+ Add New” button on the
        top left
      </li>
      &nbsp;
      <li>
        To make a change in the Category Title, click on the Edit icon in its
        row
      </li>
      &nbsp;
      <li>
        Admin cannot create the same category. A notification will display if
        category is a duplicate
      </li>
      &nbsp;
      <li>
        Disabled categories are not subject to display on the mobile side, so if
        a category is disabled mobile users will not see it. Enable/disable the
        categories by clicking on the toggle menu next to the edit icon
      </li>
      &nbsp;
      <li>Sort columns by clicking on ID or Title in the header</li>
    </ul>
  </div>
);

const Products = (
  <div className="ta-left p-text">
    <p>Products that are displayed on the Provider platform.</p>
    <ul>
      <li>
        Admin can Add New Products, Edit Existing Products, View Products,
        Delete Products if it is no longer used
      </li>
      &nbsp;
      <li>
        The Product screen displays a list of Product(s) Details (Name, Price),
        in one image
      </li>
      &nbsp;
      <li>Search any Product by Name, Price, Description, Size, and Stock</li>
      <li>
        Sort Products by clicking on the cell that has Sort Arrows (up and down
        arrow). Can sort by ID, Title and Price
      </li>
      &nbsp;
      <li>
        Add a New Product by clicking on the “+ Add New” button in the top left
        corner
      </li>
      &nbsp;
      <li>
        To view more details of one product, click on the “Eye” icon of that
        record, Tooltip is there to guide
      </li>
      &nbsp;
      <ul>
        <li>
          Click on “Size Chart” on the View screen to open the Size chart image
        </li>
        &nbsp;
      </ul>
      <li>
        For Editing purposes, there is an “Edit” icon right next to the View
        icon
      </li>
      &nbsp;
      <ul>
        <li>
          Please note, Size value is not editable, Stock Value is editable
        </li>
        &nbsp;
      </ul>
      <li>Remove a product by clicking on “Trash Can” icon</li>&nbsp;
      <li>Sort columns by clicking on names in the header</li>
      &nbsp;
      <li>
        After filling in all details click on Save button to save Product
        details
      </li>
      &nbsp;
      <li>Click on back arrow to go back to the All Products list</li>&nbsp;
      <li>
        Click on “Size Chart” to open the Size Chart. Click on the cross icon to
        return to details
      </li>
      &nbsp;
      <li>Click on cross icon to return to the details screen</li>
      &nbsp;
      <li>
        Choose “Yes” to delete the product. If “No” is selected confirm dialog
        will be closed screen will return to Products list
      </li>
    </ul>
  </div>
);

const Orders = (
  <div className="ta-left p-text">
    <p>All orders made by Providers will be displayed here:</p>
    <ul>
      <li>
        View status of whether the Order has shipped, Marked as Shipped is in a
        different color
      </li>
      &nbsp;
      <li>
        Search and sort product data by using search bar and sort icons
        respectively
      </li>
      &nbsp;
      <li>
        View Order Details with individual records by clicking on Order Image or
        person’s name
      </li>
      &nbsp;
      <li>
        Admin can Mark Order as Shipped by Clicking on Status “Mark as Shipped”
        in the Status column
      </li>
      &nbsp;
      <li>Sort columns by clicking on names in the header</li>
      &nbsp;
      <li>
        On the Order Details screen, show the Total Orders made by the Provider
        with details
      </li>
    </ul>
  </div>
);
const CustomerSupport = (
  <div className="ta-left p-text">
    <p>
      On the Customer Support screen, view Support Requests created by
      Requesters and Providers. Status of filtered data are below:
    </p>
    <ul>
      <li>Pending</li>&nbsp;
      <li>Resolved</li>&nbsp;
      <li>All Records</li>&nbsp;
      <li>By default Pending Support Requests are listed first at the top right corner</li>&nbsp;
      <li>
        View requests on the next page by using pagination at the bottom right
        corner
      </li>
      &nbsp;
      <li>
        Clicking on “View Details”, will display a Chat screen with basic
        details of respective Users. The left side of the chat is the query and
        response received from mobile users and responses will be recorded on
        the right side
      </li>
      &nbsp;
      <li>
        When the request are completed, click the “Resolve” button on the header
        and it will move the request to the Resolved section
      </li>
      &nbsp;
    </ul>
  </div>
);
const Dispute = (
  <div className="ta-left p-text">
    <p>
      On the Dispute Requests screen Dispute requests created by Requester are
      listed. Filter data by the following Status parameters:
    </p>
    <li>Pending</li>&nbsp;
    <li>Resolved</li>&nbsp;
    <li>All Records</li>&nbsp;
    <li>By default, “Pending” Support Requests are displayed first at the top right corner</li>&nbsp;
    <li>
      View additional requests on the next page using pagination at the bottom
      right corner
    </li>
    &nbsp;
    <li>
      Clicking on “View details”, will display a Chat screen with basic details
      of respective Users. The left side of the chat is the query and response
      received from mobile users will be recorded on the right side
    </li>
    &nbsp;
    <li>
      When the request are completed, click on the “Resolve” button on the
      header and it will move the request to the Resolved section
    </li>
    &nbsp;
    <li>
      Job Details will also be available to verify the dispute. Open by clicking
      on “View Details”
    </li>
  </div>
);

const ChatList = (
  <div className="ta-left p-text">
    <li>Select any requester</li>
    <li>Select any provider</li>
    <li>Search button to click requester and provider chat display in Chat List screen
</li>
  </div>
);

export default [
  {
    page: "Login",
    path: "/login",
    Body: Login,
  },
  {
    page: "Users",
    path: "/users",
    Body: Users,
  },
  {
    page: "New Jobs Details",
    path: "/new-jobs",
    Body: NewJobs,
  },
  {
    page: "In-Progress Jobs",
    path: "/inprogress-jobs",
    Body: InProgressJob,
  },
  {
    page: "Completed Jobs",
    path: "/completed-jobs",
    Body: CompletedJobs,
  },
  {
    page: "Payment",
    path: "/payment",
    Body: Payment,
  },
  {
    page: "Category",
    path: "/category",
    Body: Category,
  },
  {
    page: "Products",
    path: "/products",
    Body: Products,
  },
  {
    page: "Orders",
    path: "/orders",
    Body: Orders,
  },
  {
    page: "Customer Support",
    path: "/support",
    Body: CustomerSupport,
  },
  {
    page: "Dispute Requests",
    path: "/dispute",
    Body: Dispute,
  },
  {
    page: "Chat List",
    path: "/chat",
    Body: ChatList,
  },
];
