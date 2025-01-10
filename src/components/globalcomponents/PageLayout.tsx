/* eslint-disable @next/next/no-img-element */
import useFetchData from "@/hook/useFetchData";
import { Avatar, Button, Dropdown, Layout, Menu, theme } from "antd/lib";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import {
  FaBook,
  FaLayerGroup,
  FaNewspaper,
  FaUserFriends,
  FaUserGraduate,
} from "react-icons/fa";
import {
  GiCalendar,
  GiChemicalDrop,
  GiFarmer,
  GiPlantRoots,
  GiShoppingCart,
} from "react-icons/gi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  MdBusinessCenter,
  MdOutlineCategory,
  MdOutlineWork,
  MdPhotoLibrary,
} from "react-icons/md";
import {
  RiBarChartBoxLine,
  RiCalculatorLine,
  RiDashboardLine,
  RiLockPasswordLine,
  RiLogoutBoxLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiShieldUserLine,
  RiSlideshow2Fill,
  RiUserLine,
} from "react-icons/ri";
import { TbFileSpreadsheet } from "react-icons/tb";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useMediaQuery } from "react-responsive";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const PageLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const { fetchedData: imageData } = useFetchData(
    `/imageupload/${session?.user?.image}`
  );

  const [collapsed, setCollapsed] = useState(true);

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    setCollapsed(!isLargeScreen);
  }, [isLargeScreen]);

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "auto",
    position: isLargeScreen ? "fixed" : "relative",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    backgroundColor: "black",
    padding: "2px",
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    signOut();
  };

  const getAvatarContent = () => {
    if (imageData && imageData.data?.image) {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${imageData.data.image}`;
      return (
        <div className="w-6 lg:w-12 h-6 lg:h-12 rounded-full bg-gray-500 overflow-hidden flex items-center justify-center cursor-pointer">
          <Image
            src={imageUrl}
            alt="profile"
            className="w-full h-full object-cover"
            width={60}
            height={60}
          />
        </div>
      );
    }

    if (session?.user?.name && session.user.name !== "undefined") {
      return (
        <Avatar size="large" className="uppercase #6d4c41 cursor-pointer">
          {session.user.name.charAt(0)}
        </Avatar>
      );
    }

    return <Avatar size="large" icon={<RiUserLine />} />;
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link href="/profile">प्रोफाइल</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        लगआउत
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={siderStyle}
      >
        <div className="demo-logo-vertical mb-4 bg-[#f0be97] flex justify-center w-full p-4">
          <img src="/logo.png" alt="Logo" className="w-16 lg:w-24" />
        </div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<RiDashboardLine />}>
            <Link href="/">ड्यासबोर्ड</Link>
          </Menu.Item>

          <Menu.Item key="2" icon={<FaUserFriends />}>
            <Link href="/users">प्रयोगकर्ताहरू</Link>
          </Menu.Item>

          <Menu.Item key="3" icon={<MdOutlineWork />}>
            <Link href="/employees">कर्मचारीहरू</Link>
          </Menu.Item>

          <Menu.Item key="4" icon={<FaUserGraduate />}>
            <Link href="/experts">विशेषज्ञहरू</Link>
          </Menu.Item>

          <Menu.Item key="5" icon={<GiFarmer />}>
            <Link href="/farmers-kyc">किसान KYC</Link>
          </Menu.Item>

          <Menu.Item key="6" icon={<HiOutlineOfficeBuilding />}>
            <Link href="/agrofirms-kyc">एग्रो फर्म KYC</Link>
          </Menu.Item>

          <SubMenu
            key="crop-calendar"
            title="बाली क्यालेन्डर"
            icon={<GiCalendar />}
          >
            <Menu.Item key="12" icon={<GiPlantRoots />}>
              <Link href="/crops">बालीहरू</Link>
            </Menu.Item>
            <Menu.Item key="13" icon={<TiWeatherPartlySunny />}>
              <Link href="/seasons">ऋतुहरू</Link>
            </Menu.Item>
            <Menu.Item key="14" icon={<GiCalendar />}>
              <Link href="/crop-calendar">क्यालेन्डर</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="7" icon={<GiChemicalDrop />}>
            <Link href="/fertilizers">फर्टिलाइजरहरू</Link>
          </Menu.Item>

          <Menu.Item key="8" icon={<RiCalculatorLine />}>
            <Link href="/fertilizer-calculator">फर्टिलाइजर क्यालकुलेटर</Link>
          </Menu.Item>

          <Menu.Item key="9" icon={<FaBook />}>
            <Link href="/publication">प्रकाशन</Link>
          </Menu.Item>

          <Menu.Item key="10" icon={<FaNewspaper />}>
            <Link href="/news">समाचार</Link>
          </Menu.Item>

          <Menu.Item key="11" icon={<MdPhotoLibrary />}>
            <Link href="/images">फोटोहरू</Link>
          </Menu.Item>

          <Menu.Item key="12" icon={<RiSlideshow2Fill />}>
            <Link href="/slider-image">स्लाइडर</Link>
          </Menu.Item>

          <SubMenu
            key="business"
            title="व्यापार मोडेल"
            icon={<MdBusinessCenter />}
          >
            <Menu.Item key="13" icon={<MdOutlineCategory />}>
              <Link href="/business-categories">व्यापार वर्गहरू</Link>
            </Menu.Item>
            <Menu.Item key="14" icon={<GiShoppingCart />}>
              <Link href="/business-commodities">व्यापार वस्तुहरू</Link>
            </Menu.Item>
            <Menu.Item key="15" icon={<TbFileSpreadsheet />}>
              <Link href="/cost-sheets">लागतको तालिका</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="16" icon={<RiBarChartBoxLine />}>
            <Link href="/report">रिपोर्ट</Link>
          </Menu.Item>

          <SubMenu key="Setting" title="सेटिङ" icon={<CiSettings />}>
            <Menu.Item key="17" icon={<MdOutlineCategory />}>
              <Link href="/categories">श्रेणी</Link>
            </Menu.Item>
            <Menu.Item key="18" icon={<FaLayerGroup />}>
              <Link href="/subcategories">उप-श्रेणी</Link>
            </Menu.Item>
            <Menu.Item key="19" icon={<RiShieldUserLine />}>
              <Link href="/role-management">भूमिका व्यवस्थापन</Link>
            </Menu.Item>
            <Menu.Item key="20" icon={<RiLockPasswordLine />}>
              <Link href="/setting/change-password">पासवर्ड</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="21" icon={<RiLogoutBoxLine />} onClick={handleLogout}>
            लगआउट
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout
        style={isLargeScreen ? { marginInlineStart: collapsed ? 80 : 200 } : {}}
      >
        {" "}
        <header
          style={{ padding: 0, background: colorBgContainer }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between text-black pr-4 lg:pr-8 py-2 md:py-4">
            <div className="flex md:gap-x-2 items-center">
              <Button
                type="text"
                icon={collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 32,
                  height: 32,
                }}
              />
              <div>
                <p className="lg:text-lg">
                  नमस्ते{" "}
                  {session?.user?.name === "undefined"
                    ? `${session?.user.email}`
                    : `${session?.user.name}`}{" "}
                  👋
                </p>
                <p className="hidden md:block">
                  तपाईलाई प्रशासक प्यानलमा स्वागत छ।
                </p>
              </div>
            </div>
            <div>
              <Dropdown overlay={menu} placement="bottomRight">
                {getAvatarContent()}
              </Dropdown>
            </div>
          </div>
        </header>
        <Content
          style={{
            // minHeight: 280,
            overflowX: "auto",
          }}
          className="m-2 md:p-4 min-h-screen"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
