import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 1,
  duration: "10s",
};

export default function () {
  const url1 = "http://localhost:3000";

  const res1 = http.get(`${url1}/api/get-model`);
  const res2 = http.get(`${url1}/api/get-purchase-channel`);
  const res3 = http.get(`${url1}/api/get-agent-store`);
  const res4 = http.get(`${url1}/api/get-product-category`);
  const res5 = http.get(`${url1}/api/check-duplicate-product-code`);

  const productCode = "exampleCode"; // Replace with the product code you want to test
  const url2 = `http://localhost:3000/api/check-duplicate-product-code?productCode=${encodeURIComponent(
    productCode
  )}`;

  const response2 = http.get(url2);

  // Check if the status is 200
  check(response2, {
    "is status 200": (r) => r.status === 200,
    "response get time < 200ms": (r) => r.timings.duration < 200,
    "response get contains result": (r) => r.json().hasOwnProperty("result"),
  });

  const url = "http://localhost:3000/api/insert";

  const payload = JSON.stringify({
    lineUserId: "Uf91357ffb45b51c14826s92fa",
    fullName: "มนต์ณัฐ พันธุ์ชัยพล",
    phoneNumber: "20202020",
    purchaseChannel: "ร้านค้าตัวแทนจำหน่าย",
    productCode: "kkkk",
    agentStore: "TG Fone",
    storeCode: "TBK-NMI-15-0027",
    productCategory: "1. กระจกกันรอยเต็มจอแบบด้าน เฉพาะรุ่น iphone เท่านั้น",
    model: "iPhone 7",
    acceptPDPA: true,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(url, payload, params);

  check(response, {
    "is status post 201": (r) => r.status === 201,
    "response post time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
