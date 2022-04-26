import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { UserPlaceHolder, Edit } from "../Assets/Images/web";
import { Tooltip } from "reactstrap";
import Switch from "react-switch";
import SweetAlert from "react-bootstrap-sweetalert";

export const ConvertToAsterik = (event) => {
  var x = event.target.value;
  event.target.value = "";
  for (var i = 0; i < x.length; i++) {
    event.target.value += "*";
  }
  return event.target.value;
};

export const DropDown = (props) => {
  const { open, onClose, h51, pa, options, selected } = props;
  return (
    <>
      <ButtonDropdown
        className={`${pa} customer-support-dropdown ${h51} user-drop-down`}
        style={props.style}
        isOpen={open}
        toggle={() => onClose(!open)}
      >
        <DropdownToggle
          caret
          className="btn customer-dropdown-toggle"
          style={{ backgroundColor: "white", color: "black !importment" }}
        >
          {open ? (
            <ArrowDropUpIcon className="arrow" />
          ) : (
            <ArrowDropDownIcon className="arrow" />
          )}
          {selected}
        </DropdownToggle>
        <DropdownMenu className=" col-md-4 dropdown-menu-right-custom">
          {options &&
            options.map((item, index) => {
              return (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    props.onSelect(item.key);
                  }}
                >
                  {item.key}
                </DropdownItem>
              );
            })}
        </DropdownMenu>
      </ButtonDropdown>
    </>
  );
};

export const ConvertToCamelCase = (string) => {
  return string ? string.substr(0, 1).toUpperCase() + string.substr(1) : string;
};
// Check whether URL contains image
export function imageExists(image_url) {
  if (image_url) {
    try {
      var http = new XMLHttpRequest();
      http.open("HEAD", image_url, false);
      http.send();
      return http.status;
    } catch (e) { }
  } else {
    return 403;
  }
}

export const AllowOnlyNumbersHanlder = (e, max) => {
  if (
    (e.keyCode > 47 && e.keyCode < 58) || //numeric
    (e.keyCode > 95 && e.keyCode < 106) ||
    e.keyCode === 8 || //backspace
    (e.keyCode > 36 && e.keyCode < 41) || //up down arrow key
    e.keyCode === 46
  ) {
    // Delete key
    if (
      ((e.target.value.toString().length === undefined ||
        e.target.value.toString().length === 0) &&
        e.keyCode === 48) ||
      (String(e.target.value).length > max && e.keyCode !== 8)
    ) {
      if ([37, 38, 39, 40].includes(e.keyCode) || e.keyCode === 46) {
        return true;
      } else {
        e.preventDefault();
      }
    } else {
      return true;
    }
  } else {
    e.preventDefault();
  }
};

// return image to set in <img/>
export function setImages(image_url) {
  return image_url || UserPlaceHolder;
}

export const SortData = (props) => {
  const data = props.value.sort((a, b) => {
    if (props.type.includes("AscendingSort")) {
      return a[props.field]?.toLowerCase().trim() >
        b[props.field]?.toLowerCase().trim()
        ? 1
        : -1;
    }
    return a[props.field]?.toLowerCase().trim() <
      b[props.field]?.toLowerCase().trim()
      ? 1
      : -1;
  });
  return data;
};

// displaying message
// category Edit Icon
export const Action = ({ setAddEditCategory, item, id }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <img
        src={Edit}
        id={"edit" + id}
        className="pl-10 cur-point"
        alt="edit"
        onClick={() => {
          setAddEditCategory({ visibility: true, data: item });
        }}

      />
      <Tooltip
        placement="right"
        isOpen={tooltipOpen}
        target={"edit" + id}
        toggle={toggle}

      >
        {" "}
        Edit{" "}
      </Tooltip>
    </>
  );
};

// category disable icon
export const DisableCategory = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <div id={"switch" + props.id} className="ml-10">
        <Switch
          onChange={props.onChange}
          onColor="#0d5ea4"
          className="cur-point"
          checked={props.checked}
        />
      </div>
      <Tooltip
        placement="right"
        isOpen={tooltipOpen}
        target={"switch" + props.id}
        toggle={toggle}
      >
        {props.tooltipMsg}
      </Tooltip>
    </>
  );
};

// Product Actions
export const ActionProduct = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <img
        className={"pr-3 cur-point " + props.className}
        alt={props.id}
        id={props.id}
        src={props.src}
        onClick={props.onClick}
      />
      <Tooltip
        placement="left"
        isOpen={tooltipOpen}
        target={props.id}
        toggle={toggle}
      >
        {props.id}

      </Tooltip>
    </>
  );
};

export const ActionProvider = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <img
        className={"pr-4 cur-point " + props.className}
        style={{ paddingBottom: '60px' }}
        alt={props.id}
        id={props.id}
        src={props.src}
        onClick={props.onClick}
      />
      <Tooltip
        placement="left"
        isOpen={tooltipOpen}
        target={props.id}
        toggle={toggle}
      >
        {props.id}

      </Tooltip>
    </>
  );
};

export const OrderStatus = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <a onClick={props.onClick} id={"order-status" + props.id} href>
        {props.MarkAsShipped}
      </a>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={"order-status" + props.id}
        toggle={toggle}
      >
        {props.message}
      </Tooltip>
    </>
  );
};

// User name @ IPS user page
export const IpsUserName = (props) => {
  const { name, message, onClick } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <>
      <span id="name" className="cur-point" onClick={onClick}>
        {name}
      </span>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="name"
        toggle={toggle}
      >
        {message}
      </Tooltip>
    </>
  );
};

// convert 24 hours time to 12 hour
export const convertTimeTo12 = (t) => {
  const time = t.split(":");
  if (time[0] > 12) {
    return time[0] - 12 + ":" + time[1] + " PM";
  }
  return t + " AM";
};

export const RenderSweetAlert = (props) => {
  return (
    <SweetAlert
      className="new-pop"
      {...props}
      custom
      onCancel={props.onCancel}
      customButtons={
        <div className={`sweet-alert  ${!!props.CustomButton && "mb-25"} form-wrapper mt-0 add-new-category-button-wrapper`}>
          {props.CustomButton}
        </div>
      }
    >
      <props.Body />
    </SweetAlert>
  );
};

export const getSortedDate = (Data) => {
  const temp_date = Data.map((item) => item.job_date)
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    .sort(function (a, b) {
      return new Date(a) - new Date(b);
    });
  return temp_date;
};
