import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import PasswordChecklist from "react-password-checklist"

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  type: yup.string().required("required")
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  type: yup.string().required("required")
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  type: ""
};

const initialValuesLogin = {
  email: "",
  password: "",
  type: ""
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [invalidCrendentials,setInvalidCredentials] = useState(false);
  const [loading,setIsLoading] = useState(false);
  const [valid,setValid] = useState(false);
  const [registerButtonMessage,setRegisterButtonMessage] = useState("");

  const register = async (values, onSubmitProps) => {
    if(!valid) {
      setIsLoading(false);
      registerButtonMessage("Invalid Password");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value].trim());
    }
    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const res = await savedUserResponse.json();
    if(res._id) {
        onSubmitProps.resetForm();
        navigate('/home')
    } else {
          setIsLoading(false);
          setRegisterButtonMessage(res.message);
    }
  };

  const login = async (values, onSubmitProps) => {
    setIsLoading(true);
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn.user) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      setIsLoading(false);
      navigate("/home");
    } else {
        setIsLoading(false);
        setInvalidCredentials(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin)  login(values, onSubmitProps);
    else register(values, onSubmitProps);
  };
  return (
    <>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="User Type (User/Admin/Super Admin)"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.type}
              name="type"
              error={Boolean(touched.type) && Boolean(errors.type)}
              helperText={touched.type && errors.type}
              sx={{ gridColumn: "span 4" }}
            />
            {!isLogin&&<PasswordChecklist
				    rules={["minLength","number","capital"]}
				    minLength={5}
            style={{width: "30rem"}}
            iconSize={10}
				    value={values.password}
				    onChange={(isValid) => {setValid(isValid)}}
			      />}
            
          </Box>
          <Box>
          {(invalidCrendentials&&isLogin)?<Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "red",
                color: "black",
                "&:hover": { color: palette.primary.main },
              }}
            >
              {loading?"Loading....":isLogin ? "INVALID CRENDENTIALS" : "REGISTER"}
            </Button>:<Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {loading?"Loading....":isLogin ? "LOGIN" : registerButtonMessage?registerButtonMessage:"REGISTER"}
            </Button>}
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                setInvalidCredentials(false);
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
    </>
  );
};

export default Form;