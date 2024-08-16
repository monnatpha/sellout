import Head from "next/head";
import packageJson from "../package.json";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Home(props) {
  const { liff, liffError } = props;
  // console.log(liff.getVersion());
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-black mb-4 text-blue-700">
          ติดฟิล์มโฟกัส ลุ้นของพรีเมี่ยมฟรี 100 รางวัล
        </h1>
        <p className="mb-4">
          เพียงซื้อ กระจกกันรอยโฟกัสสำหรับ iPhone ที่ร่วมรายการ
          (ตรวจสอบสินค้าที่ร่วมรายการในตารางด้านล่าง)
          และนำรหัสสินค้าที่อยู่บนตัวสินค้า มาลงทะเบียนที่ Line Official
          @Focusshield ลุ้นรับของรางวัลสุดพิเศษรวม 100 รางวัล
        </p>
        <p className="text-lg font-black mb-4 underline underline-offset-auto">
          ของรางวัล
        </p>

        <ul className="list-disc list-inside mb-4 font-thin">
          <li>รางวัลที่ 1 airpod 2 จำนวน 10 รางวัล</li>
          <li>รางวัลที่ 2 หมอนผ้าห่มโฟกัส จำนวน 50 รางวัล</li>
          <li>รางวัลที่ 3 สายชาร์จโฟกัส 10 รางวัล</li>
          <li>รางวัลที่ 4 กระเป๋าโฟกัส พร้อม focus screen clear 30 รางวัล</li>
        </ul>
        <p className="text-lg font-black mb-4 underline underline-offset-auto">
          ระยะเวลาลงทะเบียน 10 ก.ย. - 10 ต.ค. 67
        </p>
        <p className="text-lg font-black mb-2 underline underline-offset-auto">
          กติกาสำหรับเข้าร่วมกิจกรรม
        </p>

        <ol className="list-decimal list-inside ml-4">
          <li>
            ผู้ร่วมกิจกรรมทำการสั่งซื้อ กระจกกันรอยสำหรับ iPhone ที่ร่วมรายการ
            โดยสามารถซื้อได้จากทุกช่องทาง ทั้งร้านค้า Focus Official หรือ
            ร้านค้าตัวแทนจำหน่ายทั่วประเทศ ทั้งช่องทางออนไลน์และหน้าร้าน
          </li>
          <li>
            นำรหัสสินค้าในกล่อง มาลงทะเบียนเข้าร่วมกิจกรรมที่ Line Official
            @Focusshield
          </li>
          <li>
            1 ท่าน/1 หมายเลขโทรศัพท์ จะสามารถรับรางวัลได้ท่านละ 1 รางวัลเท่านั้น
            หากได้รับรางวัลตามลำดับการจับรางวัลไปแล้ว
            จะถูกตัดสิทธิ์ไม่ได้ลุ้นในลำดับถัดไป
            (ลำดับการจับรางวัลอยู่ในเงื่อนไขกิจกรรมด้านล่าง)
          </li>
        </ol>
        <a
          href="https://docs.google.com/document/d/1qM0QCohv6TDZqJrBWRipd_MIO2-OYJjHXyYaU2dcNq8/edit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline ml-4 "
        >
          คลิกเพื่ออ่านรายละเอียดกิจกรรมเพิ่มเติม
        </a>
      </div>

      <Link
        href="/registor"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        ยอมรับเงื่อนไขกิจกรรม
      </Link>
    </div>
  );
}
