import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import liff from "@line/liff";

const Register = (props) => {
  const { liff, liffError } = props;
  if (liff != null) {
    liff.getIDToken();
    liff.getAccessToken();
  }
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    purchaseChannel: "",
    agentStore: "",
    productCode: "",
    mobileModel: "",
    acceptPDPA: false,
    productCode: "",
    storeCode: "",
    productCategory: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // setProductQR({ ...productQR, [name]: value });
    // setStoreQR({ ...storeQR, [name]: value });
  };

  const [productQR, setProductQR] = useState({
    productCode: "",
  });

  const [storeQR, setStoreQR] = useState({
    storeCode: "",
  });

  const handleSubmit = async (e) => {
    const {
      fullName,
      phoneNumber,
      purchaseChannel,
      productCode,
      agentStore,
      storeCode,
      productCategory,
      modelMobile,
      acceptPDPA,
    } = formData;
    e.preventDefault();
    try {
      console.log("Form submitted:", formData);
      const id = liff.getIDToken();
      const acc = liff.getAccessToken();
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          purchaseChannel,
          productCode,
          agentStore,
          storeCode,
          productCategory,
          modelMobile,
          acceptPDPA,
          id,
          acc,
        }),
      });
      const data = await response.json();

      toast.success("ลงทะเบียนสำเร็จ");
    } catch (error) {
      toast.error("ลงทะเบียนไม่สำเร็จ");
    }
  };

  const handleScanProductQR = () => {
    setProductQR({ productCode: "result1" });
    // liff
    //   .scanCodeV2()
    //   .then((result) => {
    //     setProductQR({ productCode: result });
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  };

  const handleScanStoreQR = () => {
    liff
      .scanCodeV2()
      .then((result) => {
        setStoreQR({ storeCode: result });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // const [scannedData, setScannedData] = useState("");

  // const handleScan = (data) => {
  //   setScannedData(data); // Store the scanned data
  //   alert(`Scanned Data: ${data}`); // Display the scanned data
  // };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">ลงทะเบียนสินค้า 4</h1>
      {/* <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
        <QRCodeScannerComponent onScan={handleScan} />
        {scannedData && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md">
            <h2 className="text-lg font-semibold">Scanned Data:</h2>
            <p>{scannedData}</p>
          </div>
        )}
      </div> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">
            ชื่อ-นามสกุล
            <span className="text-red-500"> *</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="กรอกชื่อ-นามสกุล"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "1rem" }}
            />
          </label>
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            เบอร์โทรศัพท์
            <span className="text-red-500"> *</span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="0xx-xxx-xxxx"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "1rem" }}
            />
          </label>
        </div>
        <div>
          <span className="block text-lg font-medium mb-2">
            ช่องทางการสั่งซื้อ
            <span className="text-red-500"> *</span>
          </span>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseChannel"
                value="ร้านค้าตัวแทนจำหน่าย"
                checked={formData.purchaseChannel === "ร้านค้าตัวแทนจำหน่าย"}
                placeholder="กรอกรหัสสินค้าหรือกดปุ่มสแกน QR-Code ที่ด้านล่างนี้"
                onChange={handleChange}
                required
                className="mr-2"
              />
              ร้านค้าตัวแทนจำหน่าย
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseChannel"
                value="Focus Official (Shopee, Lazada, Website)"
                checked={
                  formData.purchaseChannel ===
                  "Focus Official (Shopee, Lazada, Website)"
                }
                onChange={handleChange}
                required
                className="mr-2"
              />
              Focus Official (Shopee, Lazada, Website)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="purchaseChannel"
                value="Focus Store (หน้าร้าน)"
                checked={formData.purchaseChannel === "Focus Store (หน้าร้าน)"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Focus Store (หน้าร้าน)
            </label>
          </div>
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            รหัสสินค้า
            <span className="text-red-500"> *</span>
            <input
              type="text"
              name="productCode"
              value={productQR.productCode}
              onChange={handleChange}
              placeholder="กรอกรหัสสินค้าหรือกดปุ่มสแกน QR-Code ที่ด้านล่าง"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "1rem" }}
              disabled
            />
          </label>
          <button
            type="button"
            onClick={handleScanProductQR}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            สแกน QR-Code
          </button>
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            ร้านค้าตัวแทนจำหน่าย
            <span className="text-red-500"> *</span>
            <select
              name="agentStore"
              value={formData.agentStore}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "1rem" }}
            >
              <option value="" disabled>
                เลือกร้านค้าตัวแทนจำหน่าย
              </option>
              <option value="electronics">อิเล็กทรอนิกส์</option>
              <option value="clothing">เสื้อผ้า</option>
              <option value="furniture">เฟอร์นิเจอร์</option>
              <option value="books">หนังสือ</option>
              <option value="other">อื่นๆ</option>
            </select>
          </label>
        </div>
        {formData.agentStore === "other" && (
          <div>
            <label className="block text-lg font-medium mb-2">
              รหัสร้านค้า
              <input
                type="text"
                name="storeCode"
                value={storeQR.storeCode}
                onChange={handleChange}
                placeholder="กรอกรหัสร้านค้าหรือกดปุ่มสแกน QR-Code ที่ด้านล่าง"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "1rem" }}
              />
            </label>
            <button
              type="button"
              onClick={handleScanStoreQR}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              สแกน QR-Code
            </button>
          </div>
        )}
        <div>
          <label className="block text-lg font-medium mb-2">
            ประเภทสินค้า
            <span className="text-red-500"> *</span>
            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "1rem" }}
            >
              <option value="" disabled>
                เลือกประเภทสินค้า
              </option>
              <option value="1. กระจกกันรอยเต็มจอแบบด้าน เฉพาะรุ่น iphone เท่านั้น">
                1. กระจกกันรอยเต็มจอแบบด้าน เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="2. กระจกกันรอยเต็มจอแบบถนอมสายตา เฉพาะรุ่น iphone เท่านั้น">
                2. กระจกกันรอยเต็มจอแบบถนอมสายตา เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="3. กระจกกันรอยเต็มจอแบบปกป้องความเป็นส่วนตัว เฉพาะรุ่น iphone">
                3. กระจกกันรอยเต็มจอแบบปกป้องความเป็นส่วนตัว เฉพาะรุ่น iphone
                เท่านั้น
              </option>
              <option
                value="4. กระจกอัลติเมทแบบปกป้องความเป็นส่วนตัว เฉพาะรุ่น iphone
                เท่านั้น"
              >
                4. กระจกอัลติเมทแบบปกป้องความเป็นส่วนตัว เฉพาะรุ่น iphone
                เท่านั้น
              </option>
              <option value="5. กระจกอัลติเมทแบบเต็มจอ เฉพาะรุ่น iphone เท่านั้น">
                5. กระจกอัลติเมทแบบเต็มจอ เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="6. กระจกอัลติเมทแบบขอบใส เฉพาะรุ่น iphone เท่านั้น">
                6. กระจกอัลติเมทแบบขอบใส เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="7. กระจกอัลติเมทแบบลงโค้ง เฉพาะรุ่น iphone เท่านั้น">
                7. กระจกอัลติเมทแบบลงโค้ง เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="8. กระจกกันรอยแบบกันมอง เฉพาะรุ่น iphone เท่านั้น">
                8. กระจกกันรอยแบบกันมอง เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="9. กระจกกันรอยแบบถนอมสายตา เฉพาะรุ่น iphone เท่านั้น">
                9. กระจกกันรอยแบบถนอมสายตา เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="10. กระจกกันรอยเต็มจอลงโค้งแบบใส เฉพาะรุ่น iphone เท่านั้น">
                10. กระจกกันรอยเต็มจอลงโค้งแบบใส เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="11. กระจกกันรอยเต็มจอลงโค้งแบบด้าน เฉพาะรุ่น iphone เท่านั้น">
                11. กระจกกันรอยเต็มจอลงโค้งแบบด้าน เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option
                value="12. กระจกกันรอยเต็มจอลงโค้งแบบถนอมสายตา เฉพาะรุ่น iphone
                เท่านั้น"
              >
                12. กระจกกันรอยเต็มจอลงโค้งแบบถนอมสายตา เฉพาะรุ่น iphone
                เท่านั้น
              </option>
              <option value="13. กระจกกันรอยเต็มจอลงโค้งแบบกันมอง เฉพาะรุ่น iphone เท่านั้น">
                13. กระจกกันรอยเต็มจอลงโค้งแบบกันมอง เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option
                value="14. กระจกกันรอยเต็มจอลงโค้งขอบยืดหยุ่นแบบมัน เฉพาะรุ่น iphone
                เท่านั้น"
              >
                14. กระจกกันรอยเต็มจอลงโค้งขอบยืดหยุ่นแบบมัน เฉพาะรุ่น iphone
                เท่านั้น
              </option>
              <option value="15. กระจกกันรอยเต็มจอลงโค้ง เฉพาะรุ่น iphone เท่านั้น">
                15. กระจกกันรอยเต็มจอลงโค้ง เฉพาะรุ่น iphone เท่านั้น
              </option>
              <option value="16. กระจกกันรอยซิลิโคนเต็มจอ เฉพาะรุ่น iphone เท่านั้น">
                16. กระจกกันรอยซิลิโคนเต็มจอ เฉพาะรุ่น iphone เท่านั้น
              </option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            รุ่นมือถือ
            <span className="text-red-500"> *</span>
            <select
              name="mobileModel"
              value={formData.mobileModel}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "1rem" }}
            >
              <option value="" disabled>
                เลือกรุ่นมือถือ
              </option>
              <option value="iPhone SE 2020">iPhone SE 2020</option>
              <option value="iPhone SE 2022">iPhone SE 2022</option>
              <option value="iPhone 7">iPhone 7</option>
              <option value="iPhone 7 Plus">iPhone 7 Plus</option>
              <option value="iPhone 8">iPhone 8</option>
              <option value="iPhone 8 Plus">iPhone 8 Plus</option>
              <option value="iPhone X">iPhone X</option>
              <option value="iPhone XS">iPhone XS</option>
              <option value="iPhone XS Max">iPhone XS Max</option>
              <option value="iPhone XR">iPhone XR</option>
              <option value="iPhone 11">iPhone 11</option>
              <option value="iPhone 11 Pro">iPhone 11 Pro</option>
              <option value="iPhone 11 Pro Max">iPhone 11 Pro Max</option>
              <option value="iPhone 12">iPhone 12</option>
              <option value="iPhone 12 Mini">iPhone 12 Mini</option>
              <option value="iPhone 12 Pro">iPhone 12 Pro</option>
              <option value="iPhone 12 Pro Max">iPhone 12 Pro Max</option>
              <option value="iPhone 13">iPhone 13</option>
              <option value="iPhone 13 Mini">iPhone 13 Mini</option>
              <option value="iPhone 13 Pro">iPhone 13 Pro</option>
              <option value="iPhone 13 Pro Max">iPhone 13 Pro Max</option>
              <option value="iPhone 14<">iPhone 14</option>
              <option value="iPhone 14 Plus">iPhone 14 Plus</option>
              <option value="iPhone 14 Pro">iPhone 14 Pro</option>
              <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
              <option value="iPhone 15">iPhone 15</option>
              <option value="iPhone 15 Plus">iPhone 15 Plus</option>
              <option value="iPhone 15 Pro">iPhone 15 Pro</option>
              <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
              <option value="iPhone 16">iPhone 16</option>
              <option value="iPhone 16 Plus">iPhone 16 Plus</option>
              <option value="iPhone 16 Pro">iPhone 16 Pro</option>
              <option value="iPhone 16 Pro Max">iPhone 16 Pro Max</option>
            </select>
          </label>
        </div>

        <div>
          <span className="block text-lg font-medium mb-2">
            ข้อตกลงในการเก็บข้อมูล
            <span className="text-red-500"> *</span>
          </span>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="acceptPDPA"
                checked={formData.acceptPDPA}
                onChange={handleChange}
                required
                className="mr-2"
              />
              ยอมรับเงื่อนไข PDPA
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ลงทะเบียน
        </button>
      </form>
    </div>
  );
};

export default Register;
