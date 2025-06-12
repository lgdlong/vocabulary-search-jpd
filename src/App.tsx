import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { useVocabularySearch } from "./hooks/useVocabularySearch";
import {
  addVocabulary,
  updateVocabulary,
  removeVocabulary,
} from "./services/vocabularyService";
import Navbar from "./components/Navbar";
import VocabularyList from "./components/VocabularyList";
import DevPage from "./components/DevPage";
import SearchBox from "./components/SearchBox";
import type { JapaneseVocabulary } from "./types";

function HomePage() {
  const {
    searchFilters,
    searchResults,
    isLoading,
    handleSearch,
    clearFilters,
  } = useVocabularySearch();

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 py-4">
        <div className="search-container mb-4">
          <div className="card shadow-sm rounded-3 border">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <div className="total-count mb-2 mb-md-0">
                    <span className="fw-bold">
                      <i className="bi bi-card-list me-1"></i> Total words:{" "}
                    </span>
                    <span className="badge bg-primary">
                      {searchResults.length}
                    </span>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="search-box">
                    <SearchBox
                      searchFilters={searchFilters}
                      onSearch={handleSearch}
                      onClear={clearFilters}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VocabularyList vocabularies={searchResults} isLoading={isLoading} />
      </div>
    </>
  );
}

function DevPageContainer() {
  const { allVocabularies, exportVocabularies, handleFixDataStructure } =
    useVocabularySearch();
  const [vocabularies, setVocabularies] =
    useState<JapaneseVocabulary[]>(allVocabularies);

  // Update vocabularies when allVocabularies changes
  useEffect(() => {
    setVocabularies(allVocabularies);
  }, [allVocabularies]);

  const handleAdd = (vocabulary: JapaneseVocabulary) => {
    addVocabulary(vocabulary);
    setVocabularies([...vocabularies, vocabulary]);
  };

  const handleUpdate = (index: number, vocabulary: JapaneseVocabulary) => {
    updateVocabulary(index, vocabulary);
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies[index] = vocabulary;
    setVocabularies(updatedVocabularies);
  };

  const handleRemove = (index: number) => {
    removeVocabulary(index);
    const filteredVocabularies = vocabularies.filter((_, i) => i !== index);
    setVocabularies(filteredVocabularies);
  };

  return (
    <>
      <div className="card shadow-sm mb-4 p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-gear-fill me-2"></i>
            Vocabulary Management
          </h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success"
              onClick={exportVocabularies}
              title="Tải xuống file vocabularies.json"
            >
              <i className="bi bi-download me-1"></i>
              Export JSON
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                if (
                  window.confirm(
                    "Bạn có chắc muốn sửa cấu trúc dữ liệu? Hành động này không làm mất dữ liệu."
                  )
                ) {
                  handleFixDataStructure();
                  setVocabularies(allVocabularies);
                }
              }}
              title="Sửa cấu trúc dữ liệu mà không làm mất từ vựng"
            >
              <i className="bi bi-tools me-1"></i>
              Fix Data Structure
            </button>
          </div>
        </div>
        <div className="mt-2 text-muted small">
          <p className="mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Từ vựng được lưu tự động trong trình duyệt. Xuất JSON để sao lưu.
            <span className="ms-2 badge bg-secondary">
              {vocabularies.length} từ vựng
            </span>
          </p>
        </div>
      </div>

      <DevPage
        vocabularies={vocabularies}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dev"
          element={
            <>
              <Navbar />
              <div className="container-fluid px-4 py-4">
                <DevPageContainer />
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
