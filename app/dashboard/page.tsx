"use client";

import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const initialData = {
  categories: [
    {
      name: "CSPM",
      widgets: [
        { id: 1, name: "Cloud Accounts", content: "Widget 1 content" },
        { id: 2, name: "Cloud Account Risk Assessment", content: "Widget 2 content" },
      ],
    },
    {
      name: "CWPP",
      widgets: [
        { id: 3, name: "Workload Security", content: "Widget 3 content" },
        { id: 4, name: "Runtime Defense", content: "Widget 4 content" },
      ],
    },
    {
      name: "Image",
      widgets: [
        { id: 5, name: "Image Scanner", content: "Widget 5 content" },
      ],
    },
    {
      name: "Ticket",
      widgets: [
        { id: 6, name: "Ticket Overview", content: "Widget 6 content" },
      ],
    },
    // Add other categories and widgets as needed
  ],
};

export default function Dashboard() {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [widgetName, setWidgetName] = useState("");
  const [widgetContent, setWidgetContent] = useState("");

  const filteredData = data.categories.map((category) => ({
    ...category,
    widgets: category.widgets.filter((widget) =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const addWidget = (categoryIndex: number) => {
    setSelectedCategoryIndex(categoryIndex);
    setIsSidebarOpen(true);
  };

  const confirmAddWidget = () => {
    if (!widgetName || !widgetContent) return;

    const newWidget = { id: Date.now(), name: widgetName, content: widgetContent };
    const updatedData = { ...data };
    updatedData.categories[selectedCategoryIndex].widgets.push(newWidget);
    setData(updatedData);
    setIsSidebarOpen(false);
    setWidgetName("");
    setWidgetContent("");
  };

  const removeWidget = (categoryIndex: number, widgetIndex: number) => {
    const updatedData = { ...data };
    updatedData.categories[categoryIndex].widgets.splice(widgetIndex, 1);
    setData(updatedData);
  };

  return (
    <div className="relative flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-[40vw] bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Add a New Widget</h2>
          
          {/* Category Tabs */}
          <div className="flex mb-4 border-b">
            {data.categories.map((category, index) => (
              <button
                key={category.name}
                className={`px-4 py-2 focus:outline-none ${
                  index === selectedCategoryIndex
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setSelectedCategoryIndex(index)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Widget Name"
            value={widgetName}
            onChange={(e) => setWidgetName(e.target.value)}
            className="p-2 border mb-4 w-full"
          />
          <textarea
            placeholder="Widget Content"
            value={widgetContent}
            onChange={(e) => setWidgetContent(e.target.value)}
            className="p-2 border mb-4 w-full"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={confirmAddWidget}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <input
          type="text"
          placeholder="Search widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border mb-4 w-full"
        />
        {filteredData.map((category, categoryIndex) => (
          <div key={category.name} className="mb-6">
            <h2 className="text-xl font-bold">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.widgets.map((widget, widgetIndex) => (
                <div key={widget.id} className="border p-4 relative">
                  <h3 className="font-semibold">{widget.name}</h3>
                  <p>{widget.content}</p>
                  <button
                    onClick={() => removeWidget(categoryIndex, widgetIndex)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addWidget(categoryIndex)}
                className="border-dashed border-2 p-4 text-center flex justify-center items-center"
              >
                <FaPlus />
                Add Widget
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
