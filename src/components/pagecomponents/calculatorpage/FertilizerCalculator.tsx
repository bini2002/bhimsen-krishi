import { nepaliNumbers } from "@/utils/translations";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from "antd/lib";
import axios from "axios";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;
const { Option } = Select;

interface Fertilizer {
  id: number;
  name: string;
  nitrogen: number;
  phosphorous: number;
  potassium: number;
  image: {
    id: number;
    image: string;
    name: string;
  };
}

const FertilizerCalculator: React.FC = () => {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [selectedFertilizer, setSelectedFertilizer] =
    useState<Fertilizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const [calcResults, setCalcResults] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/fertilizer-calculator/npk`
        );
        if (response.data.success) {
          setFertilizers(response.data.data.result);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching fertilizers:", error);
        message.error("मलहरू लोड गर्न असफल भयो।");
        setLoading(false);
      }
    };

    fetchFertilizers();
  }, []);

  const handleFertilizerChange = (id: number) => {
    const selected = fertilizers.find((f) => f.id === id) || null;
    setSelectedFertilizer(selected);
  };

  const handleCalculate = async (values: any) => {
    setCalcLoading(true);
    try {
      // Use GET request with query parameters
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/fertilizer-calculator/calculate`,
        {
          params: {
            npkId: values.npkid,
            area: values.area,
          },
        }
      );
      if (response.data.success) {
        setCalcResults(response.data.data);
        setShowResults(true);
        message.success("गणना सफल भयो।");
      } else {
        message.error("गणना असफल भयो।");
      }
    } catch (error) {
      console.error("Error calculating fertilizer composition:", error);
      message.error("मलको संरचना गणना गर्न असफल भयो।");
    } finally {
      setCalcLoading(false);
    }
  };

  const doughnutData: ChartData<"doughnut", number[], string> =
    selectedFertilizer
      ? {
          labels: ["नाइट्रोजन", "फस्फोरस", "पोटाशियम"],
          datasets: [
            {
              data: [
                selectedFertilizer.nitrogen,
                selectedFertilizer.phosphorous,
                selectedFertilizer.potassium,
              ],
              backgroundColor: ["#f39c12", "#27ae60", "#3498db"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        }
      : {
          labels: [],
          datasets: [],
        };

  return (
    <div style={{ background: "#f5f5f5" }}>
      <Title level={2}>मल खुवाउने क्याल्कुलेटर</Title>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCalculate}
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              marginBottom: "20px",
            }}
          >
            <Form.Item
              label="मल"
              name="npkid"
              rules={[{ required: true, message: "कृपया मल चयन गर्नुहोस्!" }]}
            >
              <Select
                placeholder="मल चयन गर्नुहोस्"
                onChange={handleFertilizerChange}
                value={selectedFertilizer?.id}
              >
                {fertilizers.map((fertilizer) => (
                  <Option key={fertilizer.id} value={fertilizer.id}>
                    {fertilizer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="क्षेत्रफल"
              name="area"
              rules={[
                {
                  required: true,
                  message: "कृपया क्षेत्रफल प्रविष्ट गर्नुहोस्!",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="वर्ग मिटरमा क्षेत्रफल प्रविष्ट गर्नुहोस्"
                min={1}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={calcLoading}
                style={{ width: "100%" }}
              >
                गणना गर्नुहोस्
              </Button>
            </Form.Item>
          </Form>

          {showResults && selectedFertilizer && (
            <>
              <Card
                title={selectedFertilizer.name}
                bordered={false}
                style={{
                  width: "100%",
                  margin: "20px auto",
                  maxWidth: "600px",
                  overflowX: "auto",
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Doughnut
                      data={doughnutData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Divider orientation="left">पोषक तत्व विवरण</Divider>
                    <Progress
                      type="circle"
                      percent={(selectedFertilizer.nitrogen / 300) * 100}
                      format={() =>
                        `N: ${nepaliNumbers(
                          Number(selectedFertilizer.nitrogen)
                        )}`
                      }
                      strokeColor="#f39c12"
                      style={{ marginBottom: "20px" }}
                    />
                    <Progress
                      type="circle"
                      percent={(selectedFertilizer.phosphorous / 300) * 100}
                      format={() =>
                        `P: ${nepaliNumbers(
                          Number(selectedFertilizer.phosphorous)
                        )}`
                      }
                      strokeColor="#27ae60"
                      style={{ marginBottom: "20px" }}
                    />
                    <Progress
                      type="circle"
                      percent={(selectedFertilizer.potassium / 300) * 100}
                      format={() =>
                        `K: ${nepaliNumbers(
                          Number(selectedFertilizer.potassium)
                        )}`
                      }
                      strokeColor="#3498db"
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                title="गणना परिणामहरू"
                bordered={false}
                style={{
                  width: "100%",
                  margin: "20px auto",
                  maxWidth: "600px",
                }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border">
                    <h1 className="lg:text-lg font-medium">MOP</h1>
                    <p>{nepaliNumbers(Number(calcResults.mop))}</p>
                  </Card>

                  <Card className="border">
                    <h1 className="lg:text-lg font-medium">DAP</h1>
                    <p>{nepaliNumbers(Number(calcResults.dap))}</p>
                  </Card>

                  <Card className="border">
                    <h1 className="lg:text-lg font-medium">युरिया</h1>
                    <p>{nepaliNumbers(Number(calcResults.urea))}</p>
                  </Card>

                  <Card className="border">
                    <h1 className="lg:text-lg font-medium">अन्य</h1>
                    <p>{nepaliNumbers(Number(calcResults.others))}</p>
                  </Card>
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FertilizerCalculator;
