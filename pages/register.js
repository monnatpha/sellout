import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";

const Register = (props) => {
  const [options, setOptions] = useState({
    productCategory: [],
    purchaseChannel: [],
    agentStore: [],
    mobileModel: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkQR, setCheckQR] = useState(1);
  const [btnDisable, setBtnDisable] = useState(false);

  const fetchOptions = async (endpoint, optionName) => {
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${optionName}`);
      }
      const data = await response.json();

      setOptions((prevOptions) => ({
        ...prevOptions,
        [optionName]: data.result.items,
      }));
    } catch (error) {
      console.error(`Error fetching ${optionName}:`, error);
    }
  };

  useEffect(() => {
    const fetchAllOptions = async () => {
      await Promise.all([
        fetchOptions("get-product-category", "productCategory"),
        fetchOptions("get-purchase-channel", "purchaseChannel"),
        fetchOptions("get-agent-store", "agentStore"),
        fetchOptions("get-model", "mobileModel"),
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
    if (name === "agentStore") {
      setFormData((prevData) => ({
        ...prevData,
      }));
    }
    if (name === "purchaseChannel" && value !== "pcl_66818716") {
      setFormData((prevData) => ({
        ...prevData,
        agentStore: "",
        storeQR: "",
      }));
    }
    if (name === "agentStore" && value !== "as_d04fef37") {
      setFormData((prevData) => ({
        ...prevData,
        storeQR: "",
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (checkQR === 0) {
      setBtnDisable(true);

      const { phoneNumber, ...rest } = formData;
      const formattedPhoneNumber = phoneNumber.replace(/-/g, "");
      setIsModalOpen(false);
      try {
        const response = await fetch("/api/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rest,
            phoneNumber: formattedPhoneNumber,
            userLineId: liff.getContext().userId,
          }),
        });
        const data = await response.json();
        if (data.error) {
          toast.error("ลงทะเบียนไม่สำเร็จ");
          setBtnDisable(false);
          return;
        }
        toast.success("ลงทะเบียนสำเร็จ");
        liff.sendMessages([
          {
            type: "text",
            text: "ลงทะเบียนสำเร็จ",
          },
        ]);
        setBtnDisable(false);
        liff.closeWindow();
      } catch (error) {
        toast.error("ลงทะเบียนไม่สำเร็จ");
      }
    } else {
      toast.error("โปรดตรวจสอบรหัสสินค้า");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleScanQR = async (type) => {
    liff
      .scanCodeV2()
      .then(async (result) => {
        try {
          const urlObj = new URL(result.value);
          const params = new URLSearchParams(urlObj.search);
          const key = type === "รหัสสินค้า" ? "fw" : "customerNo";
          const value = params.get(key);

          if (!value) {
            toast.error("ไม่พบข้อมูลใน QR Code");
            return;
          }

          setFormData((prevData) => ({
            ...prevData,
            [type === "รหัสสินค้า" ? "productQR" : "storeQR"]: value,
          }));
          await handleBlur(value, type);
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
          `/api/check-product-code?productCode=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        const availableCode = data.result.availableCode;
        const alreadyUsed = data.result.alreadyUsed;

        if (availableCode === 0) {
          toast.warn("Product Code ไม่มีในระบบ");
          setFormData((prevData) => ({
            ...prevData,
            productQR: "",
          }));
          return;
        }
        setCheckQR(alreadyUsed);
        if (alreadyUsed === 0) {
          toast.success("Product Code สามารถใช้งานได้");
        } else {
          toast.warn("Product Code นี้ถูกใช้งานแล้ว");
          setFormData((prevData) => ({
            ...prevData,
            productQR: "",
          }));
          return;
        }
      } catch (error) {
        console.log(error, "error");
        toast.error("ตรวจสอบ Product Code ไม่สำเร็จ");
      }
    }
  };
  const checkStoreCode = async (value) => {
    if (value) {
      try {
        const response = await fetch(
          `/api/check-store-code?storeCode=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        const check = data.result.count;

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

  if (loading || btnDisable) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
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
          maxLength={10}
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
              <InputStoreCode
                label="รหัสร้านค้า"
                name="storeQR"
                type="text"
                value={formData.storeQR}
                onChange={handleChange}
                placeholder="กรอกรหัสร้านค้าหรือกดปุ่มสแกน QR Code ด้านล่าง"
              />
              <Button
                onClick={() => handleScanQR("รหัสร้านค้า")}
                text="สแกน QR Code"
                type="button"
              />
            </>
          )}
        <InputProductCode
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
          onClick={() => handleScanQR("รหัสสินค้า")}
          text="สแกน QR Code"
          type="button"
        />
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
        <Button type="submit" text="ลงทะเบียน" disabled={btnDisable} />
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
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

const InputStoreCode = ({ label, ...props }) => {
  const storeCodePattern = "^[A-Z]{3}-[A-Z]{3}-[0-9]{2}-[0-9]{4}$";

  return (
    <div>
      <label className="block text-lg font-medium">
        {label}
        <input
          {...props}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: "1rem" }}
          pattern={storeCodePattern}
          title="รหัสร้านค้าไม่ถูกต้อง TTT-TTT-XX-XXXX (T: ตัวหนังสือพิมพ์ใหญ่, X: ตัวเลข)"
        />
      </label>
    </div>
  );
};

const InputProductCode = ({ label, onBlur, ...props }) => {
  return (
    <div>
      <label className="block text-lg font-medium">
        {label}
        <span className="text-red-500"> *</span>
        <input
          {...props}
          onBlur={(e) => onBlur(e.target.value, label)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: "1rem" }}
        />
      </label>
    </div>
  );
};
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

const SelectField = ({ label, options, ...props }) => {
  return (
    <div>
      <label className="block text-lg font-medium mb-2">
        {label}
        <span className="text-red-500"> *</span>
        <select
          {...props}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: "1rem" }}
        >
          <option value="" disabled selected>
            เลือก
          </option>
          {options.map((item) => (
            <option key={item.id} value={item.id} disabled={item?.disabled}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

const Checkbox = ({ label, ...props }) => (
  <div>
    <span className="block text-lg font-medium mb-2">
      {label}
      <span className="text-red-500"> *</span>
    </span>
    <label className="flex items-center">
      <input type="checkbox" {...props} className="mr-2" />
      <a
        href="https://focusshield.com/personal-data-protection-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        ยอมรับเงื่อนไข PDPA
      </a>
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
