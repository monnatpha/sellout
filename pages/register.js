import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Register = (props) => {
  const [options, setOptions] = useState({
    productCategory: [],
    purchaseChannel: [],
    agentStore: [],
    mobileModel: [],
  });

  const [loading, setLoading] = useState(true);
  const [checkQR, setCheckQR] = useState(1);

  const fetchOptions = async (endpoint, optionName) => {
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${optionName}`);
      }
      const data = await response.json();
      setOptions((prevOptions) => ({
        ...prevOptions,
        [optionName]: data.result[0],
      }));
    } catch (error) {
      console.error(`Error fetching ${optionName}:`, error);
    }
  };

  useEffect(() => {
    const fetchAllOptions = async () => {
      await Promise.all([
        fetchOptions("getProductCategory", "productCategory"),
        fetchOptions("getPruchaseChannel", "purchaseChannel"),
        fetchOptions("getAgentStore", "agentStore"),
        fetchOptions("getModel", "mobileModel"),
      ]);
      setLoading(false);
    };
    fetchAllOptions();
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    purchaseChannel: "",
    agentStore: "",
    mobileModel: "",
    acceptPDPA: false,
    productQR: "",
    storeQR: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    if (checkQR === 0) {
      e.preventDefault();
      const { phoneNumber, ...rest } = formData;
      const formattedPhoneNumber = phoneNumber.replace(/-/g, "");
      try {
        const response = await fetch("/api/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rest,
            phoneNumber: formattedPhoneNumber,
            userLineId: props.liff.getContext().userId,
          }),
        });
        const data = await response.json();
        toast.success("ลงทะเบียนสำเร็จ");
        liff.sendMessages([
          {
            type: "text",
            text: "ลงทะเบียนสำเร็จ",
          },
        ]);
        liff.closeWindow();
      } catch (error) {
        toast.error("ลงทะเบียนไม่สำเร็จ");
      }
    } else {
      toast.error("โปรดตรวจสอบรหัสสินค้า");
    }
  };

  const handleScanQR = (type) => {
    liff
      .scanCodeV2()
      .then((result) => {
        try {
          const urlObj = new URL(result.value);
          const params = new URLSearchParams(urlObj.search);
          const key = type === "product" ? "fw" : "customerNo";
          const value = params.get(key);

          if (!value) {
            toast.error("ไม่พบข้อมูลใน QR Code");
            return;
          }

          setFormData((prevData) => ({
            ...prevData,
            [type === "product" ? "productQR" : "storeQR"]: value,
          }));
          toast.success("สแกน QR Code สำเร็จ");
        } catch (error) {
          toast.warn("QR Code ไม่ถูกต้อง");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleBlur = async (value, name) => {
    if (name === "รหัสสินค้า") await checkProdctCode(value);
    if (name === "รหัสร้านค้า") await checkStoreCode(value);
  };

  const checkProdctCode = async (value) => {
    if (value) {
      try {
        const response = await fetch(
          `/api/checkDuplicateProductCode?productCode=${encodeURIComponent(
            value
          )}`
        );
        const data = await response.json();
        const check = data.result[0][0].count;
        setCheckQR(check);
        if (check === 0) {
          toast.success("Product Code สามารถใช้งานได้");
        } else {
          toast.warn("Product Code นี้ถูกใช้งานแล้ว");
          setFormData((prevData) => ({
            ...prevData,
            productQR: "",
          }));
        }
      } catch (error) {
        toast.error("ตรวจสอบ Product Code ไม่สำเร็จ");
      }
    }
  };
  const checkStoreCode = async (value) => {
    if (value) {
      try {
        const response = await fetch(
          `/api/checkStoreCode?storeCode=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        const check = data.result[0][0].count;

        if (check === 0) {
          toast.success("Store Code สามารถใช้งานได้");
        } else {
          toast.warn("Store Code นี้ถูกใช้งานแล้ว");
          setFormData((prevData) => ({
            ...prevData,
            storeQR: "",
          }));
        }
      } catch (error) {
        toast.error("ตรวจสอบ Store Code ไม่สำเร็จ");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">ลงทะเบียนสินค้า</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="ชื่อ-นามสกุล"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="กรอกชื่อ-นามสกุล"
          required
        />
        <InputField
          label="เบอร์โทรศัพท์"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          placeholder="0xx-xxx-xxxx"
          maxLength={12}
          minLength={10}
        />
        <RadioGroup
          label="ช่องทางการสั่งซื้อ"
          name="purchaseChannel"
          options={options.purchaseChannel}
          value={formData.purchaseChannel}
          onChange={handleChange}
          required
        />
        <InputCodeField
          label="รหัสสินค้า"
          name="productQR"
          type="text"
          value={formData.productQR}
          onChange={handleChange}
          required
          placeholder="กรอกรหัสสินค้าหรือกดปุ่มสแกน QR Code ด้านล่าง"
          onBlur={handleBlur}
        />
        <Button
          onClick={() => handleScanQR("product")}
          text="สแกน QR Code"
          type="button"
        />
        {formData.purchaseChannel === "pcl_66818716" && (
          <SelectField
            label="ร้านค้าตัวแทนจำหน่าย"
            name="agentStore"
            options={options.agentStore}
            value={formData.agentStore}
            onChange={handleChange}
            required
          />
        )}
        {formData.agentStore === "as_d04fef37" &&
          formData.purchaseChannel === "pcl_66818716" && (
            <>
              <InputCodeField
                label="รหัสร้านค้า"
                name="storeQR"
                type="text"
                value={formData.storeQR}
                onChange={handleChange}
                placeholder="กรอกรหัสร้านค้าหรือกดปุ่มสแกน QR Code ด้านล่าง"
                onBlur={handleBlur}
              />
              <Button
                onClick={() => handleScanQR("store")}
                text="สแกน QR Code"
                type="button"
              />
            </>
          )}
        <SelectField
          label="ประเภทสินค้า"
          name="productCategory"
          options={options.productCategory}
          value={formData.productCategory}
          onChange={handleChange}
          required
        />
        <SelectField
          label="รุ่นมือถือ"
          name="mobileModel"
          options={options.mobileModel}
          value={formData.mobileModel}
          onChange={handleChange}
          required
        />
        <Checkbox
          label="ข้อตกลงในการเก็บข้อมูล"
          name="acceptPDPA"
          checked={formData.acceptPDPA}
          onChange={handleChange}
          required
        />
        <Button type="submit" text="ลงทะเบียน" />
      </form>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-lg font-medium mb-2">
      {label}
      <span className="text-red-500"> *</span>
      <input
        {...props}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontSize: "1rem" }}
      />
    </label>
  </div>
);

const InputCodeField = ({ label, onBlur, ...props }) => (
  <div>
    <label className="block text-lg font-medium">
      {label}
      {label == "รหัสสินค้า" ? <span className="text-red-500"> *</span> : <></>}
      <input
        {...props}
        onBlur={(e) => onBlur(e.target.value, label)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontSize: "1rem" }}
      />
    </label>
  </div>
);

const RadioGroup = ({ label, name, options, value, onChange, ...props }) => (
  <div>
    <span className="block text-lg font-medium mb-2">
      {label}
      <span className="text-red-500"> *</span>
    </span>
    <div className="space-y-2">
      {options.map((item) => (
        <label key={item.purchaseChannelId} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={item.purchaseChannelId}
            checked={value === item.purchaseChannelId}
            onChange={onChange}
            required
            className="mr-2"
            {...props}
          />
          {item.name}
        </label>
      ))}
    </div>
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-lg font-medium mb-2">
      {label}
      <span className="text-red-500"> *</span>
      <select
        {...props}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ fontSize: "1rem" }}
      >
        <option value="" disabled key="1">
          เลือก
        </option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <div>
    <span className="block text-lg font-medium mb-2">
      {label}
      <span className="text-red-500"> *</span>
    </span>
    <label className="flex items-center">
      <input type="checkbox" {...props} className="mr-2" />
      ยอมรับเงื่อนไข PDPA
    </label>
  </div>
);

const Button = ({ text, ...props }) => (
  <button
    {...props}
    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    style={{ fontSize: "1rem" }}
  >
    {text}
  </button>
);
export default Register;
