import { toast } from "react-toastify";
import { MONTHS, COLORS } from "../mocks/mock";
import { InputData } from "../types/userTypes";

export const filterString = (str: string): string => {
  return str
    .replace(/ +/g, " ")
    .replace(/\s*,\s*/g, ",")
    .replace(/,+/g, ", ")
    .replace(/^(, )|(, )$/g, "")
    .replace(/^( )|( )$/g, "");
};

export const getDate = (firstDay: number[], lastDay: number[]): string => {
  if (firstDay[1] === lastDay[1]) {
    // November 21 - 25 2022
    return `${MONTHS[firstDay[1] - 1]} ${firstDay[2]} - ${lastDay[2]} ${
      lastDay[0]
    }`;
  } else if (firstDay[0] === lastDay[0]) {
    // November 28 - December 02 2022
    return `${MONTHS[firstDay[1] - 1]} ${firstDay[2]} - ${
      MONTHS[lastDay[1] - 1]
    } ${lastDay[2]} ${lastDay[0]}`;
  } else {
    // December 29 2022 - January 02 2023
    return `${MONTHS[firstDay[1] - 1]} ${firstDay[2]} ${firstDay[0]} - ${
      MONTHS[lastDay[1] - 1]
    } ${lastDay[2]} ${lastDay[0]}`;
  }
};

export const gradientColor = (a: number): string => {
  // from -40 degrees celsius to +40
  if (a < -15) return COLORS[0];
  else if (a < -10) return COLORS[1];
  else if (a < -5) return COLORS[1];
  else if (a < 0) return COLORS[2];
  else if (a < 5) return COLORS[3];
  else if (a < 10) return COLORS[4];
  else if (a < 15) return COLORS[5];
  else if (a < 20) return COLORS[6];
  else if (a < 25) return COLORS[7];
  else if (a < 30) return COLORS[8];
  else return COLORS[9];
};

export const handleInput = (option: string): InputData => {
  let input: InputData = {
    name: "",
    email: "",
    bio: "",
    photo: "",
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
    cities: "",
    country: "",
  };
  switch (option) {
    case "ForgotPassword": {
      input.email = (
        document.getElementById("email") as HTMLInputElement
      ).value;
      (document.getElementById("email") as HTMLInputElement).value = "";
      break;
    }
    case "ResetPassword": {
      input.password = (
        document.getElementById("password") as HTMLInputElement
      ).value;
      input.passwordConfirm = (
        document.getElementById("passwordConfirm") as HTMLInputElement
      ).value;
      break;
    }
    case "UpdateMyPass": {
      input.passwordCurrent = (
        document.getElementById("current") as HTMLInputElement
      ).value;
      input.password = (
        document.getElementById("new") as HTMLInputElement
      ).value;
      input.passwordConfirm = (
        document.getElementById("newConfirm") as HTMLInputElement
      ).value;
      break;
    }
    case "UpdateNameBio": {
      input.name = (document.getElementById("name") as HTMLInputElement).value;
      input.bio = (
        document.getElementById("textArea") as HTMLTextAreaElement
      ).value;
      break;
    }
    case "account": {
      document.getElementById(option).style.color = "#FFF";
      document.getElementById(option).style.backgroundColor = "#810CA8";
      document.getElementById("password").style.color = "#810CA8";
      document.getElementById("password").style.backgroundColor = "#FFF";
      break;
    }
    case "password": {
      document.getElementById(option).style.color = "#FFF";
      document.getElementById(option).style.backgroundColor = "#810CA8";
      document.getElementById("account").style.color = "#810CA8";
      document.getElementById("account").style.backgroundColor = "#FFF";
      break;
    }
    case "Signup": {
      input.name = (document.getElementById("name") as HTMLInputElement).value;
      input.email = (
        document.getElementById("email") as HTMLInputElement
      ).value;
      input.password = (
        document.getElementById("password") as HTMLInputElement
      ).value;
      input.passwordConfirm = (
        document.getElementById("passwordConfirm") as HTMLInputElement
      ).value;
      break;
    }
    case "Login": {
      input.email = (
        document.getElementById("email") as HTMLInputElement
      ).value;
      input.password = (
        document.getElementById("password") as HTMLInputElement
      ).value;
      break;
    }
    case "Weather": {
      const hardInputString: string = (
        document.getElementById("cities") as HTMLInputElement
      ).value;
      input.cities = filterString(hardInputString);
      input.country = (
        document.getElementById("countries") as HTMLInputElement
      ).value;
      break;
    }
    default:
      toast.error("Unexpected input!", {
        position: "bottom-left",
      });
  }
  return input;
};
