import { Header } from "../components/Header";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <div className="homepage-content">
        <h1 className="homepage-hero">
          Every Pet Deserves a Loving Home.
          <br />
          <span>
            <span className="theme-green">Adopt</span> a Pet Today
          </span>
        </h1>
        <p className="homepage-desc">
          Browse our available animals and learn more about the adoption
          process. Together, we can{" "}
          <b>rescue, rehabilitate, and rehome pets in need</b>. Thank you for
          supporting our mission to bring joy to families through pet adoption.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
