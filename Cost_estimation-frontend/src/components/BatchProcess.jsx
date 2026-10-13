import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Card,
  Table,
  Button,
  Tag,
  Progress,
  Space,
  Typography,
  Modal,
  message,
  Tooltip,
  Row,
  Col,
  Statistic,
  Input,
  Spin
} from 'antd';
import {
  FiArrowLeft,
  FiDownload,
  FiEye,
  FiPlay,
  FiRefreshCw,
  FiFolder,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiMaximize2,
  FiBox
} from 'react-icons/fi';

const { Title, Text } = Typography;

const theme = {
  primary: '#145da0',
  buttonPrimary: '#246679',
  buttonHover: '#1a5661',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  background: '#f8fafc',
  cardBg: '#ffffff',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  borderColor: '#e2e8f0',
  shadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
};

const API_URL = 'http://localhost:5678';
const ANALYZE_STEP_URL = `${API_URL}/analyze-steptry/`;
const ANALYZE_IGES_URL = `${API_URL}/analyze-iges-milling`;
const ANALYZE_STL_URL = `${API_URL}/analyze-stl/`;
const CALCULATE_URL = `${API_URL}/Milling_calculate-material-costtry/`;
const CONVERT_MILLING_URL = 'http://localhost:5000/convert-milling';
const DOWNLOAD_DRACO_GLB_URL = `${API_URL}/milling/download-draco-glb/`;
const DOWNLOAD_REGULAR_GLB_URL = `${API_URL}/download-glb/`;

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 'Rs. 0.00';
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : Number(val);
  return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const normalizeCostData = (data) => {
  if (!data || typeof data !== 'object') return data;
  return {
    ...data,
    stock_mass: data.stock_weight_kg ?? data.stock_mass,
    finished_product_weight: data.actual_weight ?? data.Actual_weight ?? data.finished_product_weight,
    cost_per_unit: data.manufacturing_cost_perunit ?? data.cost_per_unit,
    material_cost_per_unit: data.material_cost_perunit ?? data.Material_cost_perunit ?? data.material_cost_per_unit,
    total_cost: data.manufacturing_cost_without_materialcost ?? data.Manufacturing_cost_without_materialcost ?? data.total_cost,
    total_cost_per_unit_with_materials: data.total_cost_per_unit_with_materials,
    with_material_cost: data.manufacturing_cost_with_material_cost ?? data.Manufacturing_cost_with_material_cost ?? data.Manufacuring_cost_with_material_cost ?? data.with_material_cost,
    material_cost: data.Total_material_cost ?? data.material_cost,
    final_unit_cost: data.final_unit_cost,
    machine_cost_breakup: data.machine_cost_breakup,
    material: data.material_name ?? data.material,
    filename: data.filename ?? data.filename,
    stock_volume_mm3: data.stock_volume_mm3
  };
};

const loadImageAsBase64 = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(this, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * Capture isometric 3D snapshot of the converted GLB model
 * Matching CostReport.jsx and ViewerPage.jsx visual quality (Image 1)
 */
const capture3DModelSnapshot = async (historyId) => {
  if (!historyId) return null;

  try {
    let arrayBuffer = null;

    // 1. Try Draco GLB endpoint
    try {
      const res = await fetch(`${DOWNLOAD_DRACO_GLB_URL}${historyId}`);
      if (res.ok) {
        arrayBuffer = await res.arrayBuffer();
      }
    } catch (e) {
      console.warn('Draco GLB fetch failed:', e);
    }

    // 2. Fallback to regular GLB endpoint if needed
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      try {
        const resFallback = await fetch(`${DOWNLOAD_REGULAR_GLB_URL}${historyId}`);
        if (resFallback.ok) {
          arrayBuffer = await resFallback.arrayBuffer();
        }
      } catch (e) {
        console.warn('Regular GLB fallback fetch failed:', e);
      }
    }

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.warn(`No GLB data retrieved for history_id ${historyId}`);
      return null;
    }

    const width = 640;
    const height = 400;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1.0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Standard lighting matching ViewerPage.jsx
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.9);
    scene.add(hemisphereLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);

    const gltf = await new Promise((resolve, reject) => {
      loader.parse(arrayBuffer, '', resolve, reject);
    });

    // Center and normalize model to standard size (exactly like ViewerPage.jsx)
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const modelGroup = new THREE.Group();
    gltf.scene.position.copy(center.negate());
    modelGroup.add(gltf.scene);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 4.0 / maxDim; // Normalized to 4 units
    modelGroup.scale.set(scale, scale, scale);
    scene.add(modelGroup);

    // Double-side and enhance materials
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          mat.side = THREE.DoubleSide;
          if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness || 0.5, 0.7);
          if (mat.metalness !== undefined) mat.metalness = Math.min(mat.metalness || 0, 0.15);
        });
      }
    });

    // True Isometric Camera orientation
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const isoDist = 4.0 * 1.5; // distance = 6.0
    camera.position.set(isoDist, isoDist * 0.85, isoDist);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    const dataUrl = canvas.toDataURL('image/png', 1.0);

    renderer.dispose();
    dracoLoader.dispose();

    return dataUrl;
  } catch (err) {
    console.warn(`Error generating 3D model snapshot for history_id ${historyId}:`, err);
    return null;
  }
};

/**
 * Generate PDF Document identical in structure and 3D view to CostReport.jsx
 */
const generatePDFDocument = async (analysisData, costData, materialName, density, quantity = 1, screenshot = null) => {
  const safeString = (value) => (value === null || value === undefined ? 'N/A' : String(value));
  const formatCurrencyForPDF = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    return `Rs.${Number(numValue).toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  const [adaLogo, companyLogo] = await Promise.all([
    loadImageAsBase64('/ADA_LOGO1.png'),
    loadImageAsBase64('/kk.png')
  ]);

  // If screenshot was not passed, generate it now
  let finalScreenshot = screenshot;
  if (!finalScreenshot && analysisData?.id) {
    finalScreenshot = await capture3DModelSnapshot(analysisData.id);
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  pdf.setFont('georgia', 'normal');
  pdf.setFillColor(20, 93, 160);
  pdf.rect(0, 10, pageWidth, 25, 'F');

  if (adaLogo) {
    try {
      pdf.addImage(adaLogo, 'JPEG', margin, 12, 20, 20);
    } catch (e) {
      console.warn('Error adding ADA logo:', e);
    }
  }

  if (companyLogo) {
    try {
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(200, 200, 200);
      pdf.roundedRect(pageWidth - margin - 22, 12, 24, 18, 1, 1, 'FD');
      pdf.addImage(companyLogo, 'PNG', pageWidth - margin - 20, 13, 20, 16);
    } catch (e) {
      console.warn('Error adding company logo:', e);
    }
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('georgia', 'bold');
  pdf.text('COST ESTIMATION REPORT', pageWidth / 2, 25, { align: 'center' });

  let yPosition = 45;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('times', 'bold');
  pdf.text(`Filename: ${safeString(costData?.filename || analysisData?.filename || 'N/A')}`, margin, yPosition);
  pdf.setFontSize(10);
  pdf.setFont('times', 'normal');
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

  yPosition += 15;

  // 3D Model View (Exact layout and border as CostReport.jsx Image 1)
  const imgWidth = contentWidth * 0.6;
  const imgHeight = imgWidth * 0.6;
  const imgX = margin + (contentWidth - imgWidth) / 2;

  if (finalScreenshot) {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(1);
    pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4);

    pdf.addImage(finalScreenshot, 'PNG', imgX, yPosition, imgWidth, imgHeight);

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('georgia', 'normal');
    pdf.text('3D Model View', pageWidth / 2, yPosition + imgHeight + 10, { align: 'center' });

    yPosition += imgHeight + 20;
  } else {
    pdf.setFillColor(240, 240, 240);
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(imgX, yPosition, imgWidth, imgHeight, 'FD');

    pdf.setFontSize(14);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('georgia', 'normal');
    pdf.text('3D Model Preview', pageWidth / 2, yPosition + imgHeight / 2, { align: 'center' });
    pdf.text('(Screenshot not available)', pageWidth / 2, yPosition + imgHeight / 2 + 10, { align: 'center' });

    yPosition += imgHeight + 20;
  }

  const tableData = [];
  tableData.push(['', '']);
  tableData.push(['MODULE: Machining Module (Milling Process)', '']);
  tableData.push(['MATERIAL DATA', '']);
  tableData.push(['Material', safeString(costData?.material || materialName || 'N/A')]);
  tableData.push(['Density', density ? `${safeString(density)} kg/m³` : 'N/A']);

  if (analysisData?.actual_dimensions) {
    tableData.push(['', '']);
    tableData.push(['FINAL COMPONENT ACTUAL DIMENSIONS', '']);
    tableData.push(['Volume (mm³)', safeString(analysisData.actual_dimensions.volume_mm3 || 'N/A')]);
    tableData.push(['Mass', costData?.finished_product_weight ? `${costData.finished_product_weight} kg` : 'N/A']);

    tableData.push(['', '']);
    tableData.push(['BOUNDING BOX DIMENSIONS', '']);
    const length = analysisData.actual_dimensions.length || 'N/A';
    const breadth = analysisData.actual_dimensions.breadth || 'N/A';
    const height = analysisData.actual_dimensions.height || 'N/A';
    tableData.push(['Length × Breadth × Height', `${length} mm × ${breadth} mm × ${height} mm`]);
  }

  if (analysisData?.stock_dimensions) {
    tableData.push(['', '']);
    tableData.push(['STOCK DIMENSIONS', '']);
    tableData.push(['Volume (mm³)', safeString(analysisData.stock_dimensions.volume_mm3 || 'N/A')]);
    tableData.push(['Mass', costData?.stock_mass ? `${costData.stock_mass} kg` : 'N/A']);

    tableData.push(['', '']);
    tableData.push(['RECOMMENDED BOUNDING BOX DIMENSIONS', '']);
    const stockLength = analysisData.stock_dimensions.length || 'N/A';
    const stockBreadth = analysisData.stock_dimensions.breadth || 'N/A';
    const stockHeight = analysisData.stock_dimensions.height || 'N/A';
    tableData.push(['Length × Breadth × Height', `${stockLength} mm × ${stockBreadth} mm × ${stockHeight} mm`]);
  }

  tableData.push(['', '']);
  tableData.push(['MANUFACTURING SETTINGS', '']);
  tableData.push(['Machine Distribution', '3 Axis (500*500*300) - 70%']);
  tableData.push(['', '4 Axis (500*500*300) - 0%']);
  tableData.push(['', '5 Axis (500*500*300) - 30%']);
  tableData.push(['Quantity', safeString(quantity)]);

  if (costData) {
    tableData.push(['', '']);
    tableData.push(['COST SUMMARY', '']);
    if (costData.material_cost_per_kg) {
      tableData.push(['Material Cost per kg', formatCurrencyForPDF(costData.material_cost_per_kg)]);
    }
    if (costData.material_cost_per_unit) {
      tableData.push(['Material Cost Per Unit', formatCurrencyForPDF(costData.material_cost_per_unit)]);
    }
    tableData.push(['Machining Cost Per Unit', formatCurrencyForPDF(costData.cost_per_unit)]);
    if (costData.material_cost) {
      tableData.push(['Total Material Cost For Given Quantity', formatCurrencyForPDF(costData.material_cost)]);
    }
    if (costData.total_cost) {
      tableData.push(['Total Machining Cost For Given Quantity', formatCurrencyForPDF(costData.total_cost)]);
    }
    if (costData.with_material_cost) {
      tableData.push(['OverAll Total Cost (Machining+Material cost)', formatCurrencyForPDF(costData.with_material_cost)]);
    }
  }

  const startY = yPosition;
  const rowHeight = 5;
  const col1Width = contentWidth * 0.6;
  let currentY = startY;

  tableData.forEach((row) => {
    const [label, value] = row;
    const isSectionHeader =
      label &&
      !value &&
      (label.includes('DIMENSIONS') ||
        label.includes('SETTINGS') ||
        label.includes('SUMMARY') ||
        label.includes('MATERIAL DATA') ||
        label.includes('MODULE:'));
    const isEmptyRow = !label && !value;

    if (isEmptyRow) {
      currentY += rowHeight / 2;
      return;
    }

    const getBackgroundColor = (lbl) => {
      if (isSectionHeader) return [41, 128, 185];
      if (lbl.includes('Volume') || lbl.includes('Length') || lbl.includes('Breadth') || lbl.includes('Height') || lbl.includes('Dimensions')) return [217, 237, 247];
      if (lbl.includes('Machine') || lbl.includes('Quantity') || lbl.includes('Distribution')) return [236, 236, 236];
      if (lbl.includes('Cost') || lbl.includes('Mass') || lbl.includes('Material')) return [245, 245, 245];
      return [255, 255, 255];
    };

    const bgColor = getBackgroundColor(label);
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(margin, currentY - 1, contentWidth, rowHeight, 'F');

    if (isSectionHeader) {
      pdf.setFont('georgia', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
    } else {
      pdf.setFont('georgia', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
    }

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.15);
    pdf.rect(margin, currentY - 1, contentWidth, rowHeight);

    if (!isSectionHeader) {
      pdf.line(margin + col1Width, currentY - 1, margin + col1Width, currentY + rowHeight - 1);
    }

    if (isSectionHeader) {
      pdf.text(safeString(label), margin + 4, currentY + 2.5);
    } else {
      pdf.text(safeString(label), margin + 2, currentY + 2.5);
      const isCostSummaryRow = (label.includes('Cost') || label.includes('Machining')) && label !== 'MATERIAL DATA' && label !== 'Material';
      if (isCostSummaryRow && label !== 'COST SUMMARY') {
        pdf.text(safeString(value), margin + contentWidth - 2, currentY + 2.5, { align: 'right' });
      } else {
        pdf.text(safeString(value), margin + col1Width + 2, currentY + 2.5);
      }
    }
    currentY += rowHeight;
  });

  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.setFont('georgia', 'normal');
  pdf.text(`Report generated on ${new Date().toLocaleString()}`, margin, pageHeight - 10);

  return pdf;
};

/**
 * Interactive 3D Model Modal Component
 * Renders the Draco GLB using the same endpoint http://localhost:5678/milling/download-draco-glb/${history_id}
 */
const Interactive3DModal = ({ open, onClose, item }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!open || !item || !item.analysisData?.id) return;

    let scene, camera, renderer, controls, frameId;
    let isCancelled = false;

    setLoading(true);
    setError(null);

    const init = async () => {
      const historyId = item.analysisData.id;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.clientWidth || 560;
      const height = canvas.clientHeight || 450;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc);

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(6, 5, 6);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, 0, 0);
      controlsRef.current = controls;

      // Lighting matching ViewerPage
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.9);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      // Fetch Draco GLB from the same endpoint
      try {
        let arrayBuffer = null;
        try {
          const res = await fetch(`${DOWNLOAD_DRACO_GLB_URL}${historyId}`);
          if (res.ok) arrayBuffer = await res.arrayBuffer();
        } catch (e) {
          console.warn('Draco GLB fetch failed:', e);
        }

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          try {
            const resFallback = await fetch(`${DOWNLOAD_REGULAR_GLB_URL}${historyId}`);
            if (resFallback.ok) arrayBuffer = await resFallback.arrayBuffer();
          } catch (e) {
            console.warn('Fallback GLB fetch failed:', e);
          }
        }

        if (isCancelled) return;

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error('3D model data is not yet available in the database.');
        }

        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);

        const gltf = await new Promise((resolve, reject) => {
          loader.parse(arrayBuffer, '', resolve, reject);
        });

        if (isCancelled) return;

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const modelGroup = new THREE.Group();
        gltf.scene.position.copy(center.negate());
        modelGroup.add(gltf.scene);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 4.0 / maxDim;
        modelGroup.scale.set(scale, scale, scale);
        scene.add(modelGroup);

        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              m.side = THREE.DoubleSide;
              if (m.roughness !== undefined) m.roughness = Math.min(m.roughness || 0.5, 0.7);
              if (m.metalness !== undefined) m.metalness = Math.min(m.metalness || 0, 0.15);
            });
          }
        });

        setLoading(false);

        const animate = () => {
          if (isCancelled) return;
          frameId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      } catch (err) {
        if (!isCancelled) {
          console.error('Error rendering interactive 3D model in modal:', err);
          setError(err.message || 'Failed to load 3D model.');
          setLoading(false);
        }
      }
    };

    // Delay slightly to ensure modal canvas is mounted in DOM
    const timer = setTimeout(init, 100);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (frameId) cancelAnimationFrame(frameId);
      if (renderer) renderer.dispose();
      if (controls) controls.dispose();
    };
  }, [open, item]);

  const setView = (viewType) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dist = 6.0;
    if (viewType === 'iso') {
      cameraRef.current.position.set(dist, dist * 0.85, dist);
    } else if (viewType === 'top') {
      cameraRef.current.position.set(0, dist * 1.5, 0);
    } else if (viewType === 'front') {
      cameraRef.current.position.set(0, 0, dist * 1.5);
    } else if (viewType === 'side') {
      cameraRef.current.position.set(dist * 1.5, 0, 0);
    }
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const dims = item?.analysisData?.actual_dimensions;
  const stock = item?.analysisData?.stock_dimensions;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiBox style={{ color: theme.buttonPrimary }} />
          <span>Interactive 3D CAD Model — {item?.name}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={940}
      centered
      destroyOnClose
    >
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* 3D Viewport */}
        <div style={{ flex: '1 1 540px', minHeight: '440px', position: 'relative', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', zIndex: 10 }}>
              <Spin size="large" />
              <Text style={{ marginTop: '12px', color: theme.buttonPrimary, fontWeight: 500 }}>
                Loading 3D Draco GLB from Database...
              </Text>
            </div>
          )}

          {error && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
              <FiAlertCircle style={{ fontSize: '32px', color: theme.error, marginBottom: '8px' }} />
              <Text style={{ color: theme.error, fontWeight: 500 }}>{error}</Text>
            </div>
          )}

          <canvas ref={canvasRef} style={{ width: '100%', height: '440px', display: 'block' }} />

          {/* View preset buttons */}
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '6px', zIndex: 5 }}>
            <Button size="small" onClick={() => setView('iso')}>ISO</Button>
            <Button size="small" onClick={() => setView('front')}>Front</Button>
            <Button size="small" onClick={() => setView('top')}>Top</Button>
            <Button size="small" onClick={() => setView('side')}>Side</Button>
          </div>
        </div>

        {/* Specifications panel */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Card size="small" title="Part Dimensions" style={{ borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
              <div><Text type="secondary">Actual Bounding Box:</Text> <strong>{dims ? `${dims.length} × ${dims.breadth} × ${dims.height} mm` : 'N/A'}</strong></div>
              <div><Text type="secondary">Actual Volume:</Text> <strong>{dims?.volume_mm3 ? `${dims.volume_mm3} mm³` : 'N/A'}</strong></div>
              <div><Text type="secondary">Part Mass:</Text> <strong>{item?.costData?.finished_product_weight ? `${item.costData.finished_product_weight} kg` : 'N/A'}</strong></div>
            </div>
          </Card>

          <Card size="small" title="Stock Material & Dimensions" style={{ borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
              <div><Text type="secondary">Stock Dimensions:</Text> <strong>{stock ? `${stock.length} × ${stock.breadth} × ${stock.height} mm` : 'N/A'}</strong></div>
              <div><Text type="secondary">Stock Mass:</Text> <strong>{item?.costData?.stock_mass ? `${item.costData.stock_mass} kg` : 'N/A'}</strong></div>
              <div><Text type="secondary">Material:</Text> <strong>{item?.costData?.material || 'Steel Alloy'}</strong></div>
            </div>
          </Card>

          <Card size="small" title="Manufacturing Quote" style={{ borderRadius: '8px', background: '#f0f9ff' }}>
            <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
              <div><Text type="secondary">Machining Cost:</Text> <strong>{formatCurrency(item?.costData?.cost_per_unit)}</strong></div>
              <div><Text type="secondary">Material Cost:</Text> <strong>{formatCurrency(item?.costData?.material_cost)}</strong></div>
              <div style={{ borderTop: '1px solid #bae6fd', paddingTop: '6px', marginTop: '6px' }}>
                <Text type="secondary">Total Quoted Cost:</Text> <strong style={{ color: theme.buttonPrimary, fontSize: '15px' }}>{formatCurrency(item?.costData?.with_material_cost)}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

const BatchProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve files from location.state or fallback to window store
  const incomingData = location.state || window.__BATCH_PROCESS_STORE__ || {};
  const [materialId] = useState(incomingData.materialId || null);
  const [materialName] = useState(incomingData.materialName || 'N/A');
  const [density] = useState(incomingData.density || null);

  const [batchItems, setBatchItems] = useState(() => {
    const rawFiles = incomingData.files || incomingData.batchFiles || [];
    return rawFiles.map((item, index) => {
      const fileObj = item.file || item;
      return {
        key: `${index}_${item.name || fileObj.name}`,
        id: index + 1,
        file: fileObj,
        name: item.name || fileObj.name || `file_${index + 1}`,
        folderName: item.folderName || 'Root_Folder',
        relativePath: item.relativePath || fileObj.webkitRelativePath || item.name || fileObj.name,
        size: item.size || fileObj.size || 0,
        status: 'pending', // 'pending' | 'analyzing' | 'calculating' | 'completed' | 'error'
        progress: 0,
        analysisData: null,
        costData: null,
        screenshot: null,
        errorMessage: null
      };
    });
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(-1);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [active3DModelItem, setActive3DModelItem] = useState(null);

  const stopRequestedRef = useRef(false);

  // Auto-process on mount if items exist and are pending
  useEffect(() => {
    if (batchItems.length > 0 && batchItems.some((item) => item.status === 'pending') && !isProcessing) {
      startBatchProcessing();
    }
  }, []);

  // Process a single item
  const processSingleItem = async (item) => {
    const isIges = item.name.toLowerCase().endsWith('.iges') || item.name.toLowerCase().endsWith('.igs');
    const isStl = item.name.toLowerCase().endsWith('.stl');
    const cleanFilename = item.name || (item.file ? item.file.name : 'model.step');

    // Step 1: Analyze
    const analyzeFormData = new FormData();
    analyzeFormData.append('file', item.file, cleanFilename);
    analyzeFormData.append('material_id', materialId);
    analyzeFormData.append('quantity', '1');

    let analyzeUrl = ANALYZE_STEP_URL;
    if (isIges) analyzeUrl = ANALYZE_IGES_URL;
    else if (isStl) analyzeUrl = ANALYZE_STL_URL;

    const analyzeResponse = await axios.post(analyzeUrl, analyzeFormData);
    const analysis = analyzeResponse.data;

    // Step 2: Calculate Cost
    const calcPayload = {
      history_id: analysis.id,
      machine_distribution: {
        '3 Axis': 70,
        '4 Axis': 0,
        '5 Axis': 30
      }
    };

    const calcResponse = await axios.post(CALCULATE_URL, calcPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const normalizedCost = normalizeCostData(calcResponse.data);

    // Step 3: Convert and store GLB/Draco for this milling record WITH history_id
    try {
      const convertFormData = new FormData();
      convertFormData.append('file', item.file, cleanFilename);
      convertFormData.append('history_id', String(analysis.id));
      await axios.post(CONVERT_MILLING_URL, convertFormData);
      console.log(`GLB converted & stored for history_id: ${analysis.id}`);
    } catch (convErr) {
      console.warn('Conversion warning (convert-milling):', convErr);
    }

    // Step 4: Render & Capture 3D Model Snapshot
    let snapshot = null;
    try {
      snapshot = await capture3DModelSnapshot(analysis.id);
    } catch (snapErr) {
      console.warn('Snapshot capture warning:', snapErr);
    }

    return { analysis, costData: normalizedCost, screenshot: snapshot };
  };

  // Start Batch Processing Queue
  const startBatchProcessing = async () => {
    if (!materialId) {
      message.error('No material selected. Please return and select a material.');
      return;
    }

    setIsProcessing(true);
    stopRequestedRef.current = false;

    for (let i = 0; i < batchItems.length; i++) {
      if (stopRequestedRef.current) break;

      const item = batchItems[i];
      if (item.status === 'completed') continue;

      setCurrentProcessingIndex(i);

      setBatchItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'analyzing', progress: 30 } : it))
      );

      try {
        setBatchItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: 'calculating', progress: 65 } : it))
        );

        const result = await processSingleItem(item);

        setBatchItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: 'completed',
                  progress: 100,
                  analysisData: result.analysis,
                  costData: result.costData,
                  screenshot: result.screenshot,
                  errorMessage: null
                }
              : it
          )
        );
      } catch (err) {
        console.error(`Error processing file ${item.name}:`, err);
        const errMsg = err.response?.data?.detail || err.message || 'Processing failed';
        setBatchItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? {
                  ...it,
                  status: 'error',
                  progress: 0,
                  errorMessage: errMsg
                }
              : it
          )
        );
      }
    }

    setIsProcessing(false);
    setCurrentProcessingIndex(-1);
    message.success('Batch processing finished!');
  };

  const handleStopProcessing = () => {
    stopRequestedRef.current = true;
    setIsProcessing(false);
    message.info('Batch processing paused.');
  };

  // Handle single item preview and download modal (Exact same layout & 3D view as CostReport.jsx)
  const handlePreviewAndDownload = async (record) => {
    if (!record.costData || !record.analysisData) {
      message.warning('File has not finished cost calculation yet.');
      return;
    }

    try {
      message.loading({ content: 'Generating PDF report preview...', key: 'gen_pdf' });

      // Generate snapshot on the fly if not already cached
      let screenshot = record.screenshot;
      if (!screenshot && record.analysisData?.id) {
        screenshot = await capture3DModelSnapshot(record.analysisData.id);
        if (screenshot) {
          setBatchItems((prev) =>
            prev.map((it) => (it.key === record.key ? { ...it, screenshot } : it))
          );
        }
      }

      const pdf = await generatePDFDocument(record.analysisData, record.costData, materialName, density, 1, screenshot);
      message.destroy('gen_pdf');

      Modal.confirm({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiEye style={{ color: theme.buttonPrimary }} />
            <span>Cost Estimation Report Preview — {record.name}</span>
          </div>
        ),
        width: '80%',
        icon: null,
        content: (
          <div style={{ height: '70vh', overflow: 'hidden' }}>
            <iframe
              src={pdf.output('bloburl')}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px'
              }}
              title="PDF Preview"
            />
          </div>
        ),
        okText: 'Download PDF',
        cancelText: 'Close',
        okButtonProps: {
          style: { background: theme.buttonPrimary, borderColor: theme.buttonPrimary }
        },
        onOk: () => {
          const filename = `Cost_Report_${record.name.replace(/\.[^/.]+$/, '')}_${new Date().getTime()}.pdf`;
          pdf.save(filename);
          message.success(`PDF report for ${record.name} downloaded successfully!`);
        }
      });
    } catch (error) {
      console.error('Error generating single PDF preview:', error);
      message.destroy('gen_pdf');
      message.error('Failed to generate PDF preview.');
    }
  };

  // Download All Reports in Dated Folder Structure
  const handleDownloadAllReports = async () => {
    const completedItems = batchItems.filter((it) => it.status === 'completed' && it.costData);
    if (completedItems.length === 0) {
      message.warning('No completed reports available to download.');
      return;
    }

    setIsDownloadingAll(true);
    setDownloadProgress(0);
    message.loading({ content: 'Packaging reports with 3D model views into dated folder...', key: 'dl_all' });

    try {
      const zip = new JSZip();

      // Current Date Format: YYYY-MM-DD
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];

      // Top-level or unique folder determination
      const uniqueFolders = [...new Set(completedItems.map((it) => it.folderName || 'Default_Folder'))];
      const mainFolderTag = uniqueFolders.length === 1 ? uniqueFolders[0] : 'Batch_Projects';
      const rootFolderName = `${currentDate}_${mainFolderTag}`;
      const rootZipFolder = zip.folder(rootFolderName);

      for (let i = 0; i < completedItems.length; i++) {
        const item = completedItems[i];

        let screenshot = item.screenshot;
        if (!screenshot && item.analysisData?.id) {
          screenshot = await capture3DModelSnapshot(item.analysisData.id);
        }

        const pdf = await generatePDFDocument(item.analysisData, item.costData, materialName, density, 1, screenshot);
        const pdfBlob = pdf.output('blob');

        // Inside the dated folder, organize by uploaded folder name
        const folderTarget = rootZipFolder.folder(item.folderName || 'General');
        const cleanName = item.name.replace(/\.[^/.]+$/, '');
        folderTarget.file(`Cost_Report_${cleanName}.pdf`, pdfBlob);

        setDownloadProgress(Math.round(((i + 1) / completedItems.length) * 100));
      }

      // Generate Zip and trigger browser download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `${rootFolderName}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      message.destroy('dl_all');
      message.success(`All reports successfully downloaded inside folder "${rootFolderName}"!`);
    } catch (err) {
      console.error('Error bundling batch reports:', err);
      message.destroy('dl_all');
      message.error('Failed to download batch reports.');
    } finally {
      setIsDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  // Metrics Calculation
  const totalFiles = batchItems.length;
  const completedCount = batchItems.filter((it) => it.status === 'completed').length;
  const errorCount = batchItems.filter((it) => it.status === 'error').length;
  const totalOverallCost = batchItems.reduce((acc, it) => {
    if (it.costData?.with_material_cost) {
      return acc + (Number(it.costData.with_material_cost) || 0);
    }
    return acc;
  }, 0);

  // Filtered files for table
  const filteredItems = batchItems.filter((it) => {
    if (!searchText) return true;
    const lower = searchText.toLowerCase();
    return (
      it.name.toLowerCase().includes(lower) ||
      it.folderName.toLowerCase().includes(lower) ||
      it.relativePath.toLowerCase().includes(lower)
    );
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (val) => <Text style={{ color: theme.textSecondary, fontWeight: 500 }}>{val}</Text>
    },
    {
      title: 'Folder Name',
      dataIndex: 'folderName',
      key: 'folderName',
      width: 150,
      render: (folder) => (
        <Space orientation="horizontal">
          <FiFolder style={{ color: theme.buttonPrimary }} />
          <Text style={{ fontWeight: 600, color: theme.buttonPrimary }}>
            {folder}
          </Text>
        </Space>
      )
    },
    {
      title: 'CAD File Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name, record) => (
        <div>
          <Space>
            <FiFile style={{ color: theme.textSecondary }} />
            <Text style={{ fontWeight: 500, color: theme.textPrimary }}>{name}</Text>
          </Space>
          <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '2px', paddingLeft: '20px' }}>
            Path: {record.relativePath}
          </div>
        </div>
      )
    },
    {
      title: '3D Preview',
      key: 'thumbnail',
      width: 120,
      render: (_, record) => {
        if (record.screenshot) {
          return (
            <Tooltip title="Click to view interactive 3D model">
              <img
                src={record.screenshot}
                alt={record.name}
                style={{
                  width: '74px',
                  height: '46px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => setActive3DModelItem(record)}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
              />
            </Tooltip>
          );
        }
        if (record.status === 'completed') {
          return (
            <Button
              size="small"
              icon={<FiBox />}
              style={{ borderRadius: '6px' }}
              onClick={() => setActive3DModelItem(record)}
            >
              View 3D
            </Button>
          );
        }
        return <Text style={{ color: theme.textSecondary, fontSize: '12px' }}>—</Text>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status, record) => {
        if (status === 'completed') {
          return (
            <Tag color="success" icon={<FiCheckCircle style={{ marginRight: '4px' }} />}>
              Completed
            </Tag>
          );
        }
        if (status === 'analyzing') {
          return <Tag color="processing">Analyzing CAD...</Tag>;
        }
        if (status === 'calculating') {
          return <Tag color="warning">Calculating Cost...</Tag>;
        }
        if (status === 'error') {
          return (
            <Tooltip title={record.errorMessage || 'Failed'}>
              <Tag color="error" icon={<FiAlertCircle style={{ marginRight: '4px' }} />}>
                Failed
              </Tag>
            </Tooltip>
          );
        }
        return <Tag color="default">Pending</Tag>;
      }
    },
    {
      title: 'Stock Dimensions (mm)',
      key: 'stock_dimensions',
      width: 180,
      render: (_, record) => {
        const dims = record.analysisData?.stock_dimensions;
        if (!dims) return <Text style={{ color: theme.textSecondary }}>—</Text>;
        return (
          <Text style={{ fontSize: '13px' }}>
            {dims.length || 0} × {dims.breadth || 0} × {dims.height || 0}
          </Text>
        );
      }
    },
    {
      title: 'Stock Mass',
      key: 'stock_mass',
      width: 100,
      render: (_, record) => {
        const mass = record.costData?.stock_mass;
        if (!mass) return <Text style={{ color: theme.textSecondary }}>—</Text>;
        return <Text>{mass} kg</Text>;
      }
    },
    {
      title: 'Machining Cost',
      key: 'cost_per_unit',
      width: 130,
      render: (_, record) => {
        const cost = record.costData?.cost_per_unit;
        if (!cost) return <Text style={{ color: theme.textSecondary }}>—</Text>;
        return <Text style={{ fontWeight: 500 }}>{formatCurrency(cost)}</Text>;
      }
    },
    {
      title: 'Material Cost',
      key: 'material_cost',
      width: 130,
      render: (_, record) => {
        const cost = record.costData?.material_cost;
        if (!cost) return <Text style={{ color: theme.textSecondary }}>—</Text>;
        return <Text style={{ fontWeight: 500 }}>{formatCurrency(cost)}</Text>;
      }
    },
    {
      title: 'Total Cost',
      key: 'with_material_cost',
      width: 140,
      render: (_, record) => {
        const cost = record.costData?.with_material_cost;
        if (!cost) return <Text style={{ color: theme.textSecondary }}>—</Text>;
        return (
          <Text style={{ fontWeight: 700, color: theme.buttonPrimary, fontSize: '14px' }}>
            {formatCurrency(cost)}
          </Text>
        );
      }
    },
    {
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      width: 250,
      render: (_, record) => (
        <Space orientation="horizontal" size="small">
          <Button
            size="small"
            type="primary"
            icon={<FiEye />}
            disabled={record.status !== 'completed'}
            style={{
              backgroundColor: record.status === 'completed' ? theme.buttonPrimary : undefined,
              borderColor: record.status === 'completed' ? theme.buttonPrimary : undefined,
              borderRadius: '6px'
            }}
            onClick={() => handlePreviewAndDownload(record)}
          >
            Report
          </Button>

          <Button
            size="small"
            icon={<FiBox />}
            disabled={record.status !== 'completed'}
            style={{
              borderRadius: '6px',
              borderColor: record.status === 'completed' ? theme.buttonPrimary : undefined,
              color: record.status === 'completed' ? theme.buttonPrimary : undefined
            }}
            onClick={() => setActive3DModelItem(record)}
          >
            3D Modal
          </Button>

          {record.status === 'error' && (
            <Button
              size="small"
              icon={<FiRefreshCw />}
              onClick={() => {
                setBatchItems((prev) =>
                  prev.map((it) => (it.key === record.key ? { ...it, status: 'pending' } : it))
                );
                if (!isProcessing) startBatchProcessing();
              }}
            >
              Retry
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ background: theme.background, minHeight: '100vh' }}>
      {/* Top Header Bar matching ViewerPage.jsx */}
      <div style={{
        height: '80px',
        background: '#246679',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(20, 93, 160, 0.3), 0 0 0 1px rgba(20, 93, 160, 0.2)',
        borderBottom: '4px solid #246679',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <button
          onClick={() => navigate('/home/machine/milling')}
          style={{
            position: 'absolute',
            left: '16px',
            padding: '8px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
          title="Back to Milling Process"
        >
          <FiArrowLeft style={{
            width: '24px',
            height: '24px',
            color: '#ffffff',
            transition: 'color 0.3s ease'
          }} />
        </button>

        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={3} style={{
            margin: 0,
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '24px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            COST ESTIMATION SOFTWARE
          </Title>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '28px 40px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: theme.buttonPrimary, fontWeight: 700 }}>
              Batch CAD Cost Estimation & Processing
            </Title>
            <Text style={{ color: theme.textSecondary, fontSize: '14px' }}>
              Sequential multi-folder and subfolder processing with 3D model modal inspection and dated folder report archiving.
            </Text>
          </div>

          {/* Action buttons */}
          <Space orientation="horizontal" size="middle">
            {isProcessing ? (
              <Button
                danger
                size="large"
                style={{ borderRadius: '8px', height: '42px', fontWeight: 500 }}
                onClick={handleStopProcessing}
              >
                Pause Processing
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<FiPlay />}
                style={{
                  background: theme.buttonPrimary,
                  borderColor: theme.buttonPrimary,
                  borderRadius: '8px',
                  height: '42px',
                  fontWeight: 500
                }}
                disabled={batchItems.length === 0 || completedCount === totalFiles}
                onClick={startBatchProcessing}
              >
                {completedCount > 0 ? 'Resume Processing' : 'Process All Files'}
              </Button>
            )}

            <Button
              type="primary"
              size="large"
              icon={<FiDownload />}
              loading={isDownloadingAll}
              disabled={completedCount === 0 || isDownloadingAll}
              style={{
                background: completedCount > 0 ? '#10b981' : undefined,
                borderColor: completedCount > 0 ? '#10b981' : undefined,
                color: '#fff',
                borderRadius: '8px',
                height: '42px',
                fontWeight: 600,
                boxShadow: completedCount > 0 ? '0 4px 14px rgba(16, 185, 129, 0.4)' : undefined
              }}
              onClick={handleDownloadAllReports}
            >
              Download All Reports (Dated Folder)
            </Button>
          </Space>
        </div>

        {/* Metrics Card Row */}
        <div style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '10px', boxShadow: theme.shadow }}>
                <Statistic
                  title={<Text style={{ color: theme.textSecondary }}>Total CAD Files</Text>}
                  value={totalFiles}
                  valueStyle={{ color: theme.buttonPrimary, fontWeight: 700 }}
                  prefix={<FiFile style={{ marginRight: '6px' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '10px', boxShadow: theme.shadow }}>
                <Statistic
                  title={<Text style={{ color: theme.textSecondary }}>Completed Reports</Text>}
                  value={completedCount}
                  valueStyle={{ color: '#10b981', fontWeight: 700 }}
                  suffix={errorCount > 0 ? `/ ${totalFiles} (${errorCount} failed)` : `/ ${totalFiles}`}
                  prefix={<FiCheckCircle style={{ marginRight: '6px' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '10px', boxShadow: theme.shadow }}>
                <Statistic
                  title={<Text style={{ color: theme.textSecondary }}>Material Assigned</Text>}
                  value={materialName}
                  valueStyle={{ color: theme.textPrimary, fontSize: '18px', fontWeight: 600 }}
                  suffix={density ? `(${density} kg/m³)` : ''}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '10px', boxShadow: theme.shadow }}>
                <Statistic
                  title={<Text style={{ color: theme.textSecondary }}>Total Batch Quote</Text>}
                  value={formatCurrency(totalOverallCost)}
                  valueStyle={{ color: theme.buttonPrimary, fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Processing Progress Bar */}
        {(isProcessing || isDownloadingAll) && (
          <div style={{ marginBottom: '20px' }}>
            <Card style={{ borderRadius: '10px', boxShadow: theme.shadow, padding: '4px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text style={{ fontWeight: 600, color: theme.buttonPrimary }}>
                  {isDownloadingAll
                    ? `Packaging Reports into Dated Folder Archive (${downloadProgress}%)`
                    : `Processing File ${currentProcessingIndex + 1} of ${totalFiles}: ${batchItems[currentProcessingIndex]?.name || ''}`}
                </Text>
                <Text style={{ color: theme.textSecondary }}>
                  {isDownloadingAll
                    ? `${downloadProgress}%`
                    : `${Math.round((completedCount / totalFiles) * 100)}% Complete`}
                </Text>
              </div>
              <Progress
                percent={isDownloadingAll ? downloadProgress : Math.round((completedCount / totalFiles) * 100)}
                status="active"
                strokeColor={{
                  '0%': theme.buttonPrimary,
                  '100%': '#10b981'
                }}
              />
            </Card>
          </div>
        )}

        {/* Table Card */}
        <Card
          style={{ borderRadius: '12px', boxShadow: theme.shadow }}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ color: theme.buttonPrimary, fontWeight: 600, fontSize: '17px' }}>
                Files & Reports Table
              </span>
              <Input.Search
                placeholder="Search file or folder name..."
                allowClear
                style={{ width: 280 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          }
        >
          <Table
            dataSource={filteredItems}
            columns={columns}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 1400 }}
            rowKey="key"
          />
        </Card>
      </div>

      {/* Interactive 3D Model Modal */}
      <Interactive3DModal
        open={!!active3DModelItem}
        onClose={() => setActive3DModelItem(null)}
        item={active3DModelItem}
      />
    </div>
  );
};

export default BatchProcess;
