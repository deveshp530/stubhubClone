import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    //change to name when it is added to models
    <h3>Welcome {currentUser.email}</h3>
  ) : (
    <h1>Please sign in or signup</h1>
  );
};

//getIntitlProps:sending the page with the data already populated
//from the server

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
