# RNAsum Explorer

<p align="center">
  <strong>🧬 Interactive Visualization Dashboard for RNAsum Reports</strong>
</p>

<p align="center">
  A modern React-based web application for exploring and interpreting RNA sequencing analysis outputs from <a href="https://github.com/umccr/RNAsum">RNAsum</a>.
</p>

---

## ✨ Features

### 📊 Comprehensive Molecular Profiling
- **Findings Summary** — Consolidated view of all altered genes with section presence indicators
- **Mutated Genes** — Tiered variant classifications with expression context
- **Fusion Genes** — Interactive Circos plot visualization of fusion events
- **Structural Variants** — Expression profiles for SV-affected genes
- **Copy Number Alterations** — Gain/loss visualization with Z-scores
- **Immune Markers** — PD-L1, TMB, and immune infiltration metrics
- **HRD Genes** — Homologous recombination deficiency gene panel
- **Cancer Genes** — Oncogene and tumor suppressor expression profiles

### 🔗 Clinical Resources Integration
Direct links to genomic knowledge bases:
- [VICC](https://search.cancervariants.org/)
- [OncoKB](https://www.oncokb.org/)
- [CIViC](https://civicdb.org/)
- [COSMIC](https://cancer.sanger.ac.uk/cosmic)
- [FusionGDB](https://ccsm.uth.edu/FusionGDB/)

### 📁 Data Management
- **JSON Upload** — Load custom patient data with built-in schema validation
- **Template Download** — Get a sample JSON template to structure your data
- **Persistence** — Uploaded data survives page refreshes via localStorage
- **PDF Export** — Generate multi-page PDF reports for clinical review

### 🎨 Modern UI/UX
- Sticky sidebar navigation for easy section access
- Responsive design with light/dark mode support
- Interactive charts and visualizations (Recharts)
- Searchable and filterable data tables

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/umccr/rnasum-explorer.git
cd rnasum-explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## 📦 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Charts** | Recharts |
| **PDF Export** | html2canvas + jsPDF |
| **State** | React Context + localStorage |

---

## 📄 Data Format

The application accepts JSON files matching the `PatientData` schema:

```typescript
interface PatientData {
  sampleInfo: {
    sampleId: string;
    patientId: string;
    cancerType: string;
    referenceCohort: string;
    analysisDate: string;
    libraryId: string;
    purity: number;      // 0-1
    ploidy: number;
  };
  geneExpressions: GeneExpression[];
  geneFusions: GeneFusion[];
  mutatedGenes: MutatedGene[];
  cnvGenes: CNVGene[];
  drugMatches: DrugMatch[];
  immuneMarkers: ImmuneMarker[];
}
```

Use the **"Download Template"** button in the app to get a complete example.

---

## 🔬 About RNAsum

[RNAsum](https://github.com/umccr/RNAsum) is an R package developed by the **University of Melbourne Centre for Cancer Research (UMCCR)** for integrating whole-genome sequencing (WGS) and whole-transcriptome sequencing (WTS) data from cancer patients.

This dashboard provides a modern, interactive frontend for exploring RNAsum outputs, designed for:
- Clinical genomics teams
- Molecular tumor boards
- Research scientists analyzing cancer transcriptomics

---

## 📚 Documentation

- [RNAsum Documentation](https://umccr.github.io/RNAsum/)
- [RNAsum GitHub](https://github.com/umccr/RNAsum)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📝 License

This project is developed by UMCCR. See the original [RNAsum repository](https://github.com/umccr/RNAsum) for licensing information.

---

<p align="center">
  Built by <a href="https://genomic-cancer-medicine.unimelb.edu.au/">Collaborative Centre for Genomic Cancer Medicine</a>
</p>
