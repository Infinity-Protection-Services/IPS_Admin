import * as commonAction from "../../Utils/commonActions";
import { loginInstance } from "../../Common/axiosInstance";
import { storageUtils } from "../../Utils";
import { Auth } from "aws-amplify";
import * as actionTypes from "../../Common/actionTypes";

export const Login = (values, entity, type) => {
  return async (dispatch) => {
    dispatch(commonAction.SetLoader(true));
    return loginInstance
      .post("/login", values)
      .then(function (response) {
        dispatch(commonAction.SetLoader(false));
          if (response.data.statuscode === 200) {
            storageUtils.setAuthenticatedUser(JSON.stringify(response.data.data));
            dispatch(commonAction.SetData({ payload: response.data.message, entity: entity, type: type, }));
            if (storageUtils.getAuthenticatedUser()) {
              values?.location?.push("/new-jobs")
            }
          } else { dispatch(commonAction.setredux(response.data.message, 'error_message', actionTypes.ERROR_MESSAGE)) }
      })
      .catch(function (error) {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.setredux("Error in login", 'error_message', actionTypes.ERROR_MESSAGE))
      });
  };
};

// Signup with RDS - currently not in use
export const SignUp = () => {
  return function (dispatch) {
    return loginInstance({
      url: "/signup",
      method: "post",
      data: {
        type: "signup",
        first_name: "Demo ",
        last_name: "Test",
        email: "demotest@gmail.com",
        phone_no: "7984032370",
        user_role_id: 1,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

// Login with cognito
export const LoginWithCognitoHandler = (props) => {
  const { values } = props;
  return async (dispatch) => {
    dispatch(commonAction.SetLoader(true));
    return Auth.signIn(values.email, values.password)
      .then((user) => {
        dispatch(commonAction.SetLoader(false));
        if (user.challengeName && user.challengeName === "NEW_PASSWORD_REQUIRED") {
          dispatch(commonAction.setredux("Please create new password!", 'error_message', actionTypes.ERROR_MESSAGE));
          dispatch(commonAction.SetData({ entity: "userDataToChangePassword", payload: user }));
        }
        else {
          const Values = {
            type: "login",
            email: values.email,
            device_token: "",
            device_type: "web",
            app_version: "1.0",
            cognito_user_id: user.attributes.sub,
            token: user.signInUserSession.accessToken.jwtToken,
            user_role_id: 1,
          };
          dispatch(Login(Values, "LoginUser", actionTypes.SUCCESS_LOGIN));
        }
      })
      .catch((error) => {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.setredux(error.message, 'error_message', actionTypes.ERROR_MESSAGE));
      });
  };
};

// Change password with RDS
export const ChangePasswordHandler = (props, values) => {
  return async (dispatch) => {
    dispatch(commonAction.SetLoader(true));
    return Auth.completeNewPassword(
      props.userDataToChangePassword,
      values.password,
      { name: props.userDataToChangePassword.username, })
      .then((user) => {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.SetNull({ type: actionTypes.FETCH, entity: "userDataToChangePassword" }));
        dispatch(commonAction.setredux("Please login with new password", 'success_message', actionTypes.SUCCESS_MESSAGE))
        props.history.push("/success");
      })
      .catch((e) => {
        dispatch(commonAction.SetLoader(false));
        dispatch(commonAction.setredux('Error in Updating password', 'error_message', actionTypes.ERROR_MESSAGE));
      });
  };
};

export const LogoutWithCognitoHandler = () => {
  return async (dispatch) => {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken()
    await Auth.signOut()
    await dispatch(LogoutHandler(token))

  }
}

export const LogoutHandler = (token) => {
  return async function (dispatch) {
    return loginInstance({
      url: "/userlogout",
      method: "post",
      data: {
        "type": "userLogOut",
        "user_id": 1,
        "token": token
      }
    }).then((response) => {
      dispatch(commonAction.setredux("logout", 'Logout'))

    }).catch(error => {
      console.log(error);
    })

  }
}
