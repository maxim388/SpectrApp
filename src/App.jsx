// src/App.js
import { Layout, Menu, theme } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import TableApp from "./components/Table/TableApp";
import ChartApp from "./components/Chart/ChartApp";
import AnalysisChartApp from "./components/Chart/AnalysisChartApp";
import { WavelengthProvider } from "./context/WavelengthContext";

const { Header, Content, Footer } = Layout;

const items1 = [
  { key: "/SpectrApp/table", label: "Таблица" },
  { key: "/SpectrApp/chart", label: "График" },
  { key: "/SpectrApp/results", label: "Результаты" },
];

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
          onClick={handleMenuClick}
        />
      </Header>
      <div style={{ padding: "0 48px" }}>
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <Routes>
              <Route path="/SpectrApp/table" element={<TableApp />} />
              <Route path="/SpectrApp/chart" element={<ChartApp />} />
              <Route path="/SpectrApp/results" element={<AnalysisChartApp />} />
              <Route path="/SpectrApp/" element={<TableApp />} />
            </Routes>
          </Content>
        </Layout>
      </div>
      <Footer style={{ textAlign: "center" }}>
        Viktar Raznichenka © {new Date().getFullYear()} Created
      </Footer>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <WavelengthProvider>
        <AppContent />
      </WavelengthProvider>
    </Router>
  );
};

export default App;
