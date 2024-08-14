"use client";

import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { initialData } from "@/constant";

export default function Dashboard() {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [widgetName, setWidgetName] = useState("");
  const [widgetContent, setWidgetContent] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

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
    if (!widgetName || !widgetContent || selectedCategoryIndex === null) return;

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

  const addCategory = () => {
    if (!newCategoryName) return;

    const updatedData = { ...data };
    updatedData.categories.push({ name: newCategoryName, widgets: [] });
    setData(updatedData);
    setNewCategoryName("");
    setIsSidebarOpen(false);
  };

  const removeCategory = (categoryIndex: number) => {
    const updatedData = { ...data };
    updatedData.categories.splice(categoryIndex, 1);
    setData(updatedData);
  };

  return (
    <div className="relative flex flex-col h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-[25vw] bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Manage Items</h2>
          
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
                <button
                  onClick={() => removeCategory(index)}
                  className="ml-2 text-red-500"
                >
                  <FaTimes />
                </button>
              </button>
            ))}
          </div>

          {/* Add Category Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="p-2 border mb-4 w-full"
            />
            <button
              onClick={addCategory}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>

          {/* Add Widget Section */}
          {selectedCategoryIndex !== null && (
            <>
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
              <div className="mt-4 flex justify-end gap-6">
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
            </>
          )}
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
        
        {/* Render each category's widgets */}
        {filteredData.map((category, categoryIndex) => (
          <div key={category.name} className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{category.name}</h2>
            <div className="flex gap-4 items-start">
              {category.widgets.length > 0 ? (
                <>
                  {category.widgets.map((widget, widgetIndex) => (
                    <div key={widget.id} className="border p-4 w-1/3 relative h-[17vh] rounded-xl">
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
                </>
              ) : (
                <p className="w-full">No widgets found in this category.</p>
              )}
              <button
                onClick={() => addWidget(categoryIndex)}
                className="border-dashed border-2 p-4 flex justify-center items-center w-1/3 h-[17vh] bg-gray-100 rounded-xl"
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
