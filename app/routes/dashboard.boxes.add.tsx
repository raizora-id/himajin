import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { mockBoxes, getSectionsFromBoxes, getRowsFromBoxes, getColumnsFromBoxes, getLevelsFromBoxes } from "~/features/dashboard/models/box.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Add New Box - POS System" },
    { name: "description", content: "Create a new box for inventory management" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get all active warehouses for selection
  const warehouses = mockWarehouses.filter(warehouse => warehouse.isActive);
  
  // Get all sections, rows, columns, and levels from all boxes
  const sections = getSectionsFromBoxes();
  const rows = getRowsFromBoxes();
  const columns = getColumnsFromBoxes();
  const levels = getLevelsFromBoxes();
  
  return json({
    warehouses,
    sections,
    rows,
    columns,
    levels
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Extract form data
  const name = formData.get("name")?.toString() || "";
  const warehouseId = formData.get("warehouseId")?.toString();
  const section = formData.get("section")?.toString();
  const row = formData.get("row")?.toString();
  const column = formData.get("column")?.toString();
  const level = Number(formData.get("level"));
  const capacity = Number(formData.get("capacity"));
  const isActive = formData.get("isActive") === "true";
  const code = formData.get("code")?.toString();
  
  // Validate the form data
  const errors: Record<string, string> = {};
  
  if (!warehouseId) {
    errors.warehouseId = "Warehouse is required";
  }
  
  if (!section) {
    errors.section = "Section is required";
  }
  
  if (!row) {
    errors.row = "Row is required";
  }
  
  if (!column) {
    errors.column = "Column is required";
  }
  
  if (isNaN(level) || level < 0) {
    errors.level = "Level must be a non-negative number";
  }
  
  if (isNaN(capacity) || capacity <= 0) {
    errors.capacity = "Capacity must be a positive number";
  }
  
  if (!code) {
    errors.code = "Box code is required";
  } else {
    // Check if code is already used by another box
    const existingBoxWithSameCode = mockBoxes.find(b => b.code === code);
    if (existingBoxWithSameCode) {
      errors.code = "This box code is already in use";
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, create the box in the database and get its new ID
  // For demo purposes, we'll just redirect back to the boxes list
  
  return redirect("/dashboard/boxes");
};

function FormField({ 
  id, 
  label, 
  error, 
  children,
  required = false
}: { 
  id: string; 
  label: string; 
  error?: string; 
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

// Helper to generate unique box code based on warehouse and location
function generateBoxCode(warehouseCode: string, section: string, row: string, column: string): string {
  if (!warehouseCode || !section || !row || !column) return "";
  
  // Extract first 3 letters of warehouse code
  const prefix = warehouseCode.split('-')[0];
  return `${prefix}-${section}${row}-${column.padStart(3, '0')}`;
}

export default function AddBox() {
  const { 
    warehouses, 
    sections, 
    rows, 
    columns, 
    levels 
  } = useLoaderData<typeof loader>();
  
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(warehouses[0]?.id || "");
  const [selectedSection, setSelectedSection] = useState<string>(sections[0] || "A");
  const [selectedRow, setSelectedRow] = useState<string>(rows[0] || "1");
  const [selectedColumn, setSelectedColumn] = useState<string>(columns[0] || "1");
  const [boxCode, setBoxCode] = useState<string>("");
  
  // New section/row/column/level inputs
  const [isCustomSection, setIsCustomSection] = useState<boolean>(false);
  const [customSection, setCustomSection] = useState<string>("");
  const [isCustomRow, setIsCustomRow] = useState<boolean>(false);
  const [customRow, setCustomRow] = useState<string>("");
  const [isCustomColumn, setIsCustomColumn] = useState<boolean>(false);
  const [customColumn, setCustomColumn] = useState<string>("");
  const [isCustomLevel, setIsCustomLevel] = useState<boolean>(false);
  const [customLevel, setCustomLevel] = useState<string>("1");
  
  // Find the current warehouse
  const currentWarehouse = warehouses.find(w => w.id === selectedWarehouseId);
  
  // Effect to generate box code when location or warehouse changes
  useEffect(() => {
    if (currentWarehouse) {
      const section = isCustomSection ? customSection : selectedSection;
      const row = isCustomRow ? customRow : selectedRow;
      const column = isCustomColumn ? customColumn : selectedColumn;
      
      if (section && row && column) {
        const newCode = generateBoxCode(currentWarehouse.code, section, row, column);
        setBoxCode(newCode);
      }
    }
  }, [
    currentWarehouse, 
    selectedSection, 
    selectedRow, 
    selectedColumn,
    isCustomSection,
    customSection,
    isCustomRow,
    customRow,
    isCustomColumn,
    customColumn
  ]);
  
  // Handle warehouse change
  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWarehouseId(e.target.value);
  };
  
  // Handle section change
  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "new") {
      setIsCustomSection(true);
      setCustomSection("");
    } else {
      setIsCustomSection(false);
      setSelectedSection(value);
    }
  };
  
  // Handle row change
  const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "new") {
      setIsCustomRow(true);
      setCustomRow("");
    } else {
      setIsCustomRow(false);
      setSelectedRow(value);
    }
  };
  
  // Handle column change
  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "new") {
      setIsCustomColumn(true);
      setCustomColumn("");
    } else {
      setIsCustomColumn(false);
      setSelectedColumn(value);
    }
  };
  
  // Handle level change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "new") {
      setIsCustomLevel(true);
      setCustomLevel("");
    } else {
      setIsCustomLevel(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/dashboard/boxes"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Boxes
        </Link>
        <h2 className="text-2xl font-bold">Add New Box</h2>
        <p className="text-muted-foreground">Create a new box for inventory management</p>
      </div>
      
      <Form method="post" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Box Information</h3>
            <div className="space-y-4">
              <FormField 
                id="code" 
                label="Box Code" 
                error={actionData?.errors?.code}
                required
              >
                <input
                  id="code"
                  name="code"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={boxCode}
                  onChange={(e) => setBoxCode(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Code is automatically generated based on warehouse and location
                </p>
              </FormField>
              
              <FormField 
                id="name" 
                label="Box Name" 
                error={actionData?.errors?.name}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Optional box name"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name is optional and helps identify the box purpose (e.g., "Display Models")
                </p>
              </FormField>
              
              <FormField 
                id="warehouseId" 
                label="Warehouse" 
                error={actionData?.errors?.warehouseId}
                required
              >
                <select
                  id="warehouseId"
                  name="warehouseId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedWarehouseId}
                  onChange={handleWarehouseChange}
                  required
                >
                  <option value="">Select a warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField 
                id="capacity" 
                label="Capacity (units)" 
                error={actionData?.errors?.capacity}
                required
              >
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="100"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum number of items this box can hold
                </p>
              </FormField>
              
              <FormField 
                id="isActive" 
                label="Status" 
                error={actionData?.errors?.isActive}
              >
                <select
                  id="isActive"
                  name="isActive"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue="true"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </FormField>
            </div>
          </div>
          
          {/* Box Location */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Box Location</h3>
            <div className="space-y-4">
              {selectedWarehouseId ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField 
                      id="section" 
                      label="Section" 
                      error={actionData?.errors?.section}
                      required
                    >
                      {isCustomSection ? (
                        <div className="flex gap-2">
                          <input
                            id="customSection"
                            name="section"
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={customSection}
                            onChange={(e) => setCustomSection(e.target.value)}
                            placeholder="A, B, C, etc."
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomSection(false);
                              setSelectedSection(sections[0] || "A");
                            }}
                            className="px-3 py-2 bg-muted rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <select
                          id="section"
                          name="section"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={selectedSection}
                          onChange={handleSectionChange}
                          required
                        >
                          {sections.map((sectionOption) => (
                            <option key={sectionOption} value={sectionOption}>
                              Section {sectionOption}
                            </option>
                          ))}
                          <option value="new">Add New Section...</option>
                        </select>
                      )}
                    </FormField>
                    
                    <FormField 
                      id="row" 
                      label="Row" 
                      error={actionData?.errors?.row}
                      required
                    >
                      {isCustomRow ? (
                        <div className="flex gap-2">
                          <input
                            id="customRow"
                            name="row"
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={customRow}
                            onChange={(e) => setCustomRow(e.target.value)}
                            placeholder="1, 2, 3, etc."
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomRow(false);
                              setSelectedRow(rows[0] || "1");
                            }}
                            className="px-3 py-2 bg-muted rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <select
                          id="row"
                          name="row"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={selectedRow}
                          onChange={handleRowChange}
                          required
                        >
                          {rows.map((rowOption) => (
                            <option key={rowOption} value={rowOption}>
                              Row {rowOption}
                            </option>
                          ))}
                          <option value="new">Add New Row...</option>
                        </select>
                      )}
                    </FormField>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField 
                      id="column" 
                      label="Column" 
                      error={actionData?.errors?.column}
                      required
                    >
                      {isCustomColumn ? (
                        <div className="flex gap-2">
                          <input
                            id="customColumn"
                            name="column"
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={customColumn}
                            onChange={(e) => setCustomColumn(e.target.value)}
                            placeholder="1, 2, 3, etc."
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomColumn(false);
                              setSelectedColumn(columns[0] || "1");
                            }}
                            className="px-3 py-2 bg-muted rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <select
                          id="column"
                          name="column"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={selectedColumn}
                          onChange={handleColumnChange}
                          required
                        >
                          {columns.map((columnOption) => (
                            <option key={columnOption} value={columnOption}>
                              Column {columnOption}
                            </option>
                          ))}
                          <option value="new">Add New Column...</option>
                        </select>
                      )}
                    </FormField>
                    
                    <FormField 
                      id="level" 
                      label="Level" 
                      error={actionData?.errors?.level}
                      required
                    >
                      {isCustomLevel ? (
                        <div className="flex gap-2">
                          <input
                            id="customLevel"
                            name="level"
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={customLevel}
                            onChange={(e) => setCustomLevel(e.target.value)}
                            min="1"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomLevel(false);
                            }}
                            className="px-3 py-2 bg-muted rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <select
                          id="level"
                          name="level"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue={levels[0]?.toString() || "1"}
                          onChange={handleLevelChange}
                          required
                        >
                          {levels.map((levelOption) => (
                            <option key={levelOption} value={levelOption}>
                              Level {levelOption}
                            </option>
                          ))}
                          <option value="new">Add New Level...</option>
                        </select>
                      )}
                    </FormField>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Box Location Preview</h4>
                    <div className="rounded-md bg-muted/50 p-3 font-mono text-sm">
                      {currentWarehouse?.name} &gt; 
                      {isCustomSection ? customSection : selectedSection}-
                      {isCustomRow ? customRow : selectedRow}-
                      {isCustomColumn ? customColumn : selectedColumn}-
                      {isCustomLevel ? customLevel : levels[0] || "1"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      The box location is used to identify where products are stored in the warehouse
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Please select a warehouse first to set the box location
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Location Map Preview */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6">Location Map Preview</h3>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-3">
                Map visualization would appear here in the full implementation
              </p>
              <p className="text-xs text-muted-foreground">
                In a full implementation, you would see a visual representation of the warehouse layout
                with sections, rows, columns, and levels, and the location of this box highlighted.
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/dashboard/boxes"
            className="bg-muted text-foreground hover:bg-muted/80 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting || !selectedWarehouseId}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Box
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
