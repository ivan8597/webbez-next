import { Content} from "../components/context/langContext";


interface Data {
  url: string;
  actionType: string;
}
interface Errors {
  isWebAddress: string;
  isTaskSelected: string;
  statusValidate: boolean;
}
export const web = /^(([a-zA-Z0-9\-\.а-яА-ЯёЁ]+)\.([a-zA-Zа-яА-ЯёЁ]{2,}))(\/?)$/;
export const webHttp =
  /^http:\/\/(([a-zA-Z0-9\-\.а-яА-ЯёЁ]+)\.([a-zA-Zа-яА-ЯёЁ]{2,}))(\/?)$/;
//  export const webHttps =
//   /^https:\/\/(([a-zA-Z0-9\-\.а-яА-ЯёЁ]+)\.([a-zA-Zа-яА-ЯёЁ]{2,}))$/;
const webHttps = /^https:\/\/([a-zA-Z0-9\-\.а-яА-ЯёЁ]+)\.([a-zA-Zа-яА-ЯёЁ]{2,})(\/?)$/;


const validator = (validateMethod: string[], data: Data,content:Content): Errors => {




  const errors = {
    isWebAddress: "",
    isTaskSelected: "",
    statusValidate: false,
  };
  for (let i = 0; i < validateMethod.length; i++) {
    switch (validateMethod[i]) {
      case "isWebAddress": {
        // const http = /^http:\/\/.+\..+$/g;
        // const https = /^https:\/\/.+\..+$/g;
        // const web = /^(https?):\/\/(([a-zA-Z0-9\-\.а-яА-ЯёЁ]+)\.([a-zA-Zа-яА-ЯёЁ]{2,}))$/;

       
        if (web.test(data.url) || webHttp.test(data.url) || webHttps.test(data.url)) {
          errors.isWebAddress = "";
        } else {
          errors.isWebAddress = content.isWbAddress
            
        }
        break;
      }
      case "isTaskSelected": {
        if (!data.actionType) {
          errors.isTaskSelected = content.isTaskSelected
        } else {
          errors.isTaskSelected = "";
        }
        break;
      }
      default:
        break;
    }
  }

  !errors.isWebAddress && !errors.isTaskSelected
    ? (errors.statusValidate = true)
    : (errors.statusValidate = false);
  return errors;
};

export default validator;
