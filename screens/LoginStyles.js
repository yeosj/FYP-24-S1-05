import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#888",
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  signInText: {
    color: "white",
    fontSize: 16,
  },
  socialLogin: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "32%",
  },
  socialText: {
    color: "black",
    fontSize: 14,
  },
  signUpText: {
    textAlign: "center",
  },
  signUpLink: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    flex: 1,
    fontSize: 16,
  },
});

export default styles;
