import React, { useState, useEffect } from 'react';
import './App.css';
import Splash from './components/Splash';
import Home from './components/Home';
import { Route, Switch } from 'react-router-dom';
import SideNav from './components/SideNav';
import NavBar from './components/NavBar';
import AccountForm from './components/AccountForm';
import VendorProfile from './components/VendorProfile';
import ListingDetail from './components/ListingDetail';
import CreateListing from './components/CreateListing';
import EditDetails from './components/EditDetails';
import EditField from './components/EditField';

function App() {
  const [splash, setSplash] = useState(true);
  const [user, setUser] = useState();
  const [setListingToEdit] = useState();

  const hideSplash = () => {
    setSplash(false);
  };
  useEffect(() => {
    setTimeout(() => {
      hideSplash();
    }, 3000);
    console.log(localStorage.userId);
    if (localStorage.userId) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/vendors/${localStorage.userId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            let tempUser = data;
            delete tempUser.password;
            setUser(tempUser);
          } else {
            localStorage.removeItem('userId');
          }
        });
    }
  }, []);
  return (
    <div className="App">
      {/*================SPLASH PAGE================*/}
      {splash ? (
        <Splash hideSplash={hideSplash} splash={splash} />
      ) : (
        <>
          <SideNav user={user} />
          <main className="app-content">
            <Switch>
              <Route
                exact
                path="/"
                component={() => (
                  <Home hideSplash={hideSplash} splash={splash} />
                )}
              />
              <Route
                exact
                path="/login"
                component={() => <AccountForm setUser={setUser} user={user} />}
              />
              <Route
                exact
                path="/vendors/:id"
                render={(routerProps) => (
                  <VendorProfile
                    match={routerProps.match}
                    user={user}
                    setUser={setUser}
                  />
                )}
              />
              <Route
                exact
                path="/vendors/:vendorId/listings/:listingId"
                render={(routerProps) => (
                  <ListingDetail user={user} match={routerProps.match} />
                )}
              />
              <Route
                exact
                path="/newlisting"
                render={(routerProps) => {
                  return <CreateListing user={user} />;
                }}
              />
              <Route
                path="/edit/account"
                exact
                render={(routerProps) => (
                  <EditDetails
                    setUser={setUser}
                    setListingToEdit={setListingToEdit}
                    editType="vendor"
                    user={user}
                    match={routerProps.match}
                  />
                )}
              />
              <Route
                path="/edit/listing/:id"
                exact
                render={(routerProps) => (
                  <EditDetails
                    setUser={setUser}
                    setListingToEdit={setListingToEdit}
                    editType="listing"
                    user={user}
                    match={routerProps.match}
                  />
                )}
              />
              <Route
                path="/edit/account/:field/"
                exact
                render={(routerProps) => (
                  <EditField
                    editType="vendor"
                    user={user}
                    match={routerProps.match}
                    setUser={setUser}
                  />
                )}
              />
              <Route
                path="/edit/listing/:id/:field/"
                exact
                render={(routerProps) => (
                  <EditField
                    editType="listing"
                    user={user}
                    match={routerProps.match}
                    setUser={setUser}
                  />
                )}
              />
            </Switch>
          </main>
          <footer className="nav-container">
            <NavBar splash={splash} user={user} />
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
