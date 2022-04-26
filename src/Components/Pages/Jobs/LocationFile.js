import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import {
  Col,
  Row
} from "reactstrap";

const LocationSearchInput = (props) => {
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country,setCountry] = useState("");

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    setAddress(address);
    try {
      geocodeByAddress(address)
        .then((results) => {
          results[0].address_components.forEach((add_comp) => {
            if (add_comp.types.includes("establishment")) {
              props.setFieldValue("street_address", add_comp.long_name);
            }
            if (add_comp.types.includes("route")) {
              props.setFieldValue("street_address", add_comp.long_name);
            }
            if (add_comp.types.includes("sublocality_level_1", "sublocality")) {
              props.setFieldValue("long_name", add_comp.long_name);
            }
            if (
              add_comp.types.includes("locality", "political") ||
              add_comp.types.includes(
                "administrative_area_level_2",
                "political"
              )
            ) {
              props.setFieldValue("city", add_comp.long_name);
            }
            if (
              add_comp.types.includes(
                "administrative_area_level_1",
                "political"
              )
            ) {
              props.setFieldValue("state", add_comp.long_name);
            }
            if (add_comp.types.includes("country")) {
              props.setFieldValue("location", add_comp.long_name);
            }
            if (add_comp.types.includes("postal_code")) {
              props.setFieldValue("zipcode", add_comp.long_name);
            }
          });
        })
        .then((latLng) => console.log("Success"))
        .catch((error) => console.error("Error", error));
    } catch (error) {
      console.error("Error...", error);
    }
  };

  return (
    <>
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
        <Row>
        <Col lg="12" className="mb-2">
          <input
           className="form-control"
            {...getInputProps({
              placeholder: "Search Location",
              className: "form-control"
            })}
          />
          </Col>
          </Row>
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#a0cdff", cursor: "pointer" }
                : { backgroundColor: "#e0eaf5", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })}
                >
                  <div style={{fontSize:"14.5px",fontFamily:"Segoe UI",color:"#black"}}>{suggestion.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  </>
  );
};

export default LocationSearchInput;
