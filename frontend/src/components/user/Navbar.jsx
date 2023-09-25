import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";

const Navbar = () => {
  return (
    <div className=" bg-secondary shadow-sm shadow-gray-500">
      <Container className=" p-2">
        <div className="flex justify-between items-center">
          <img src="./logo.png" alt="" />
          <ul className=" flex items-center space-x-4">
            <li>
              <button className=" bg-dark-subtle p-1 rounded">
                <BsFillSunFill className=" text-secondary" size={24} />
              </button>
            </li>
            <li>
              <input
                type="text"
                placeholder="search..."
                className=" border-2 border-dark-subtle p-1 outline-none focus:border-white text-xl rounded bg-transparent transition text-white"
              />
            </li>
            <li className=" text-white font-semibold text-xl">Login</li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
