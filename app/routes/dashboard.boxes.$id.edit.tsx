import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { mockBoxes, formatBoxLocation } from "~/features/dashboard/models/box.model";
import { mockWarehouses } from "~/features/dashboard/models/warehouse.model";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit Box - POS System" },
    { name: "description", content: "Edit box details" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const boxId = params.id;
  
  // Find the box by ID
  const box = mockBoxes.find((box) => box.id === boxId);
  
  if (!box) {
    throw new Response("Box not found", { status: 404 });
  }
  
  // Get all warehouses for selection
  const warehouses = mockWarehouses.filter(warehouse => warehouse.isActive);
  
  // Get all sections, rows, columns, and levels from all boxes
  const sections = Array.from(new Set(mockBoxes.map(box => box.section))).sort();
  const rows = Array.from(new Set(mockBoxes.map(box => box.row))).sort();
  const columns = Array.from(new Set(mockBoxes.map(box => box.column))).sort();
  const levels = Array.from(new Set(mockBoxes.map(box => box.level))).sort();
  
  return json({
    box,
    warehouses,
    sections,
    rows,
    columns,
    levels
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const boxId = params.id;
  
  // Find the box to edit
  const box = mockBoxes.find((box) => box.id === boxId);
  
  if (!box) {
    throw new Response("Box not found", { status: 404 });
  }
  
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
  
  if (capacity < box.usedCapacity) {
    errors.capacity = `Capacity cannot be less than current used capacity (${box.usedCapacity} units)`;
  }
  
  if (!code) {
    errors.code = "Box code is required";
  } else {
    // Check if code is already used by another box
    const existingBoxWithSameCode = mockBoxes.find(b => b.id !== boxId && b.code === code);
    if (existingBoxWithSameCode) {
      errors.code = "This box code is already in use";
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // In a real app, update the box in the database
  // For demo purposes, we'll just redirect back to the box detail page
  
  return redirect(`/dashboard/boxes/${boxId}`);
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

export default function EditBox() {
  const { 
    box, 
    warehouses, 
    sections, 
    rows, 
    columns, 
    levels 
  } = useLoaderData<typeof loader>();
  
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(box.warehouseId);
  const [boxCode, setBoxCode] = useState<string>(box.code);
  
  // Find the current warehouse
  const currentWarehouse = warehouses.find(w => w.id === selectedWarehouseId);
  
  // Generate box code when location changes
  const generateBoxCode = (warehouseId: string, section: string, row: string, column: string) => {
    if (!warehouseId || !section || !row || !column) {
      return boxCode;
    }
    
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (!warehouse) {
      return boxCode;
    }
    
    // Extract first 3 letters of warehouse code
    const prefix = warehouse.code.split('-')[0];
    return `${prefix}-${section}${row}-${column.padStart(3, '0')}`;
  };
  
  // Handle warehouse change
  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWarehouseId = e.target.value;
    setSelectedWarehouseId(newWarehouseId);
    
    // Update code based on new warehouse and current location
    const formSection = document.querySelector<HTMLSelectElement>('[name="section"]');
    const formRow = document.querySelector<HTMLSelectElement>('[name="row"]');
    const formColumn = document.querySelector<HTMLSelectElement>('[name="column"]');
    
    if (formSection && formRow && formColumn) {
      const newCode = generateBoxCode(
        newWarehouseId, 
        formSection.value, 
        formRow.value, 
        formColumn.value
      );
      setBoxCode(newCode);
    }
  };
  
  // Handle location change (section, row, column)
  const handleLocationChange = () => {
    const formSection = document.querySelector<HTMLSelectElement>('[name="section"]');
    const formRow = document.querySelector<HTMLSelectElement>('[name="row"]');
    const formColumn = document.querySelector<HTMLSelectElement>('[name="column"]');
    
    if (formSection && formRow && formColumn) {
      const newCode = generateBoxCode(
        selectedWarehouseId, 
        formSection.value, 
        formRow.value, 
        formColumn.value
      );
      setBoxCode(newCode);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/dashboard/boxes/${box.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Box Details
        </Link>
        <h2 className="text-2xl font-bold">Edit Box</h2>
        <p className="text-muted-foreground">Update box information and location</p>
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
                  defaultValue={box.name || ""}
                  placeholder="Optional box name"
                />
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
                  min={box.usedCapacity}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  defaultValue={box.capacity}
                  required
                />
                {box.usedCapacity > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current used capacity: {box.usedCapacity} units
                  </p>
                )}
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
                  defaultValue={box.isActive ? "true" : "false"}
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
              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  id="section" 
                  label="Section" 
                  error={actionData?.errors?.section}
                  required
                >
                  <select
                    id="section"
                    name="section"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={box.section}
                    onChange={handleLocationChange}
                    required
                  >
                    {sections.map((sectionOption) => (
                      <option key={sectionOption} value={sectionOption}>
                        Section {sectionOption}
                      </option>
                    ))}
                    <option value="new">Add New Section...</option>
                  </select>
                </FormField>
                
                <FormField 
                  id="row" 
                  label="Row" 
                  error={actionData?.errors?.row}
                  required
                >
                  <select
                    id="row"
                    name="row"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={box.row}
                    onChange={handleLocationChange}
                    required
                  >
                    {rows.map((rowOption) => (
                      <option key={rowOption} value={rowOption}>
                        Row {rowOption}
                      </option>
                    ))}
                    <option value="new">Add New Row...</option>
                  </select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  id="column" 
                  label="Column" 
                  error={actionData?.errors?.column}
                  required
                >
                  <select
                    id="column"
                    name="column"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={box.column}
                    onChange={handleLocationChange}
                    required
                  >
                    {columns.map((columnOption) => (
                      <option key={columnOption} value={columnOption}>
                        Column {columnOption}
                      </option>
                    ))}
                    <option value="new">Add New Column...</option>
                  </select>
                </FormField>
                
                <FormField 
                  id="level" 
                  label="Level" 
                  error={actionData?.errors?.level}
                  required
                >
                  <select
                    id="level"
                    name="level"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={box.level}
                    required
                  >
                    {levels.map((levelOption) => (
                      <option key={levelOption} value={levelOption}>
                        Level {levelOption}
                      </option>
                    ))}
                    <option value="new">Add New Level...</option>
                  </select>
                </FormField>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Current Location</h4>
                <div className="rounded-md bg-muted/50 p-3 font-mono text-sm">
                  {currentWarehouse?.name} &gt; {formatBoxLocation(box)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  When you change the location, the box code will be updated automatically
                </p>
              </div>
              
              {box.items.length > 0 && (
                <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/30 p-4 mt-2">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Warning</h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    This box contains {box.items.length} item(s). Changing the location will move all items.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to={`/dashboard/boxes/${box.id}`}
            className="bg-muted text-foreground hover:bg-muted/80 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
