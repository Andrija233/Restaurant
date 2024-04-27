import landingImage from "../assets/landing.png";
import appImage from "../assets/appDownload.png";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate()
  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    })
  };
  return (
    <div className="flex flex-col gap-12">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-10">
        <h1 className="text-5xl font-bold tracking-tight text-orange-600">
          Welcome to DishDash
        </h1>
        <span className="text-xl">The best food delivery service</span>
        <SearchBar placeHolder="Search for restaurants by City or Town" onSubmit={handleSearchSubmit}/>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <img src={landingImage} alt="" />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-bold text-3xl tracking-tighter">
                Order food from your favorite restaurants even faster!
            </span>
            <span>
                Download the app now for faster food delivery.
            </span>
                <img src={appImage} alt="" />
        </div>
      </div>
    </div>
  )
}

export default HomePage
