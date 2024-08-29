import Link from "next/link";

export default function Home(props) {
  // if (!props?.liff?.isLoggedIn()) {
  //   props?.liff?.login();
  // }
  function getMobileOperatingSystem() {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent || window.opera;

      if (/android/i.test(userAgent)) {
        return "Android";
      }

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
      }

      return "unknown";
    }

    return "unknown";
  }

  console.log(getMobileOperatingSystem(), "getMobileOperatingSystem2");
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="container mx-auto p-4">
        {getMobileOperatingSystem() === "Android" ? (
          <h1 className="text-3xl font-black mb-4 mt-72">
            ติดฟิล์มโฟกัส ลุ้นของพรีเมียม 100 รางวัล android
          </h1>
        ) : (
          <h1 className="text-3xl font-black mb-4 mt-4">
            ติดฟิล์มโฟกัส ลุ้นของพรีเมียม 100 รางวัล iphone
          </h1>
        )}

        <p className="mb-4">
          เพียงซื้อ กระจกกันรอยโฟกัสสำหรับ iPhone ที่ร่วมรายการ
          (ตรวจสอบสินค้าที่ร่วมรายการในรายละเอียดกิจกรรมเพิ่มเติม)
          และนำรหัสสินค้าที่อยู่บนตัวสินค้า มาลงทะเบียนที่ Line Official
          @Focusshield ลุ้นรับของรางวัลสุดพิเศษรวม 100 รางวัล
        </p>
        <p className="text-lg font-black mb-4 underline underline-offset-auto">
          ของรางวัล
        </p>

        <p>รางวัลที่ 1 AirPods (รุ่นที่ 2) จำนวน 10 รางวัล</p>
        <p>รางวัลที่ 2 หมอนผ้าห่มโฟกัส จำนวน 50 รางวัล</p>
        <p>รางวัลที่ 3 สายชาร์จโฟกัส 10 รางวัล</p>
        <p className="mb-4">
          รางวัลที่ 4 กระเป๋าโฟกัส พร้อม Focus Screen Clear 30 รางวัล
        </p>
        <p className="text-lg font-black mb-4 underline underline-offset-auto">
          ระยะเวลาลงทะเบียน 20 ก.ย. 2567 - 9 ต.ค. 2567
        </p>
        <p className="text-lg font-black mb-4 underline underline-offset-auto">
          กติกาสำหรับเข้าร่วมกิจกรรม
        </p>

        <ol className="ml-4 mb-2">
          <li>
            1. ผู้ร่วมกิจกรรมทำการสั่งซื้อ กระจกกันรอยสำหรับ iPhone
            ที่ร่วมรายการ โดยสามารถซื้อได้จากทุกช่องทาง ทั้งร้านค้า Focus
            Official หรือ ร้านค้าตัวแทนจำหน่ายทั่วประเทศ
            ทั้งช่องทางออนไลน์และหน้าร้าน
          </li>
          <li>
            2. นำรหัสสินค้าในกล่อง มาลงทะเบียนเข้าร่วมกิจกรรมที่ Line Official
            @Focusshield
          </li>
          <li>
            3. 1 ท่าน/1 หมายเลขโทรศัพท์ จะสามารถรับรางวัลได้ท่านละ 1
            รางวัลเท่านั้น หากได้รับรางวัลตามลำดับการจับรางวัลไปแล้ว
            จะถูกตัดสิทธิ์ไม่ได้ลุ้นในลำดับถัดไป
            (ลำดับการจับรางวัลอยู่ในเงื่อนไขกิจกรรมด้านล่าง)
          </li>
        </ol>

        <a
          href="https://focusshield.com/iphone-16/lucky-draw-premium"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline "
        >
          คลิกเพื่ออ่านรายละเอียดกิจกรรมเพิ่มเติม
        </a>
      </div>

      <Link
        href="/register"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        ยอมรับเงื่อนไขกิจกรรม
      </Link>
    </div>
  );
}
