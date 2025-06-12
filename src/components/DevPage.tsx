import { useState, useEffect, useCallback } from "react";
import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";
import type { JapaneseVocabulary } from "../types";

interface DevPageProps {
  vocabularies: JapaneseVocabulary[];
  onAdd: (vocabulary: JapaneseVocabulary) => void;
  onUpdate: (index: number, vocabulary: JapaneseVocabulary) => void;
  onRemove: (index: number) => void;
}

export default function DevPage({
  vocabularies,
  onAdd,
  onUpdate,
  onRemove,
}: DevPageProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<JapaneseVocabulary>({
    kanji: "",
    hiragana: "",
    romaji: "",
    vietnamese: "",
  });
  const [kuroshiro, setKuroshiro] = useState<Kuroshiro | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize Kuroshiro once on component mount
  useEffect(() => {
    const initializeKuroshiro = async () => {
      try {
        setIsInitializing(true);
        const kuroshiroInstance = new Kuroshiro();
        await kuroshiroInstance.init(new KuromojiAnalyzer());
        setKuroshiro(kuroshiroInstance);
      } catch (error) {
        console.error("Failed to initialize Kuroshiro:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeKuroshiro();

    // Clean up on unmount
    return () => {
      setKuroshiro(null);
    };
  }, []);
  // Function to convert text using Kuroshiro
  const convertWithKuroshiro = useCallback(
    async (text: string, to: "hiragana" | "romaji") => {
      if (!kuroshiro) return text;

      try {
        return await kuroshiro.convert(text, { to });
      } catch (error) {
        console.error(`Error converting to ${to}:`, error);
        return text;
      }
    },
    [kuroshiro]
  ); // Handle input changes with async conversion
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Create updated form data first so we can use it for conversions
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    // Update state with the new value
    setFormData(updatedFormData);
    if (kuroshiro && value) {
      try {
        // Auto-fill romaji from hiragana
        if (name === "hiragana" && updatedFormData.romaji === "") {
          const romaji = await convertWithKuroshiro(value, "romaji");
          setFormData((prev) => ({
            ...prev,
            romaji,
          }));
        }
        // Auto-fill hiragana from romaji
        else if (name === "romaji" && updatedFormData.hiragana === "") {
          const hiragana = await convertWithKuroshiro(value, "hiragana");
          setFormData((prev) => ({
            ...prev,
            hiragana,
          }));
        }
      } catch (error) {
        console.error("Error during Japanese text conversion:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editIndex !== null) {
      onUpdate(editIndex, formData);
      setEditIndex(null);
    } else {
      onAdd(formData);
    }

    // Reset form
    setFormData({
      kanji: "",
      hiragana: "",
      romaji: "",
      vietnamese: "",
    });
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setFormData(vocabularies[index]);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setFormData({
      kanji: "",
      hiragana: "",
      romaji: "",
      vietnamese: "",
    });
  };
  return (
    <div className="vocabulary-table-container">
      {isInitializing && (
        <div className="alert alert-info mb-3">
          <i className="bi bi-info-circle me-2"></i>
          Đang khởi tạo công cụ xử lý tiếng Nhật...
        </div>
      )}
      <h2 className="mb-4">
        <i
          className={`bi ${
            editIndex !== null ? "bi-pencil-square" : "bi-plus-square"
          } me-2`}
        ></i>
        {editIndex !== null ? "Edit" : "Add"} Vocabulary
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mb-5 p-4 shadow-sm rounded bg-white"
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="kanji" className="form-label">
              Kanji
            </label>
            <input
              type="text"
              className="form-control"
              id="kanji"
              name="kanji"
              value={formData.kanji}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="hiragana" className="form-label">
              Hiragana
            </label>
            <input
              type="text"
              className="form-control"
              id="hiragana"
              name="hiragana"
              value={formData.hiragana}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="romaji" className="form-label">
              Romaji
            </label>
            <input
              type="text"
              className="form-control"
              id="romaji"
              name="romaji"
              value={formData.romaji}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="vietnamese" className="form-label">
              Vietnamese
            </label>
            <input
              type="text"
              className="form-control"
              id="vietnamese"
              name="vietnamese"
              value={formData.vietnamese}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12 d-flex gap-2 justify-content-end">
            {" "}
            {editIndex !== null && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              <i
                className={`bi ${
                  editIndex !== null ? "bi-save" : "bi-plus-circle"
                } me-1`}
              ></i>
              {editIndex !== null ? "Update" : "Add"} Vocabulary
            </button>
          </div>
        </div>
      </form>
      <h2 className="mb-3">
        <i className="bi bi-list-ul me-2"></i>
        Vocabulary List
      </h2>{" "}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover mb-0">
          <thead>
            <tr>
              <th>Kanji</th>
              <th>Hiragana</th>
              <th>Romaji</th>
              <th>Vietnamese</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vocabularies.map((vocab, index) => (
              <tr key={index}>
                <td>{vocab.kanji}</td>
                <td>{vocab.hiragana}</td>
                <td>{vocab.romaji}</td>
                <td>{vocab.vietnamese}</td>
                <td>
                  <div className="d-flex gap-2">
                    {" "}
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(index)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemove(index)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
