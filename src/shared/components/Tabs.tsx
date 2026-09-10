import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   COMPOUND COMPONENT : Tabs
   L'état actif est partagé implicitement via Context, ce qui
   laisse au consommateur une API déclarative :

   <Tabs defaultValue="products">
     <Tabs.List>
       <Tabs.Trigger value="products">Produits</Tabs.Trigger>
     </Tabs.List>
     <Tabs.Panel value="products">...</Tabs.Panel>
   </Tabs>
========================================================= */

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`<${component}> doit être utilisé à l'intérieur de <Tabs>`);
  }

  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export default function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const baseId = useId();

  // Mode contrôlé si `value` est fourni, sinon état interne
  const activeValue = value ?? internalValue;

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      activeValue,
      baseId,
      setActiveValue: (next: string) => {
        if (value === undefined) {
          setInternalValue(next);
        }

        onValueChange?.(next);
      },
    }),
    [activeValue, baseId, onValueChange, value],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }: { children: ReactNode }) {
  useTabsContext("Tabs.List");

  return (
    <div className="tabs-list" role="tablist">
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  icon?: string;
  count?: number;
  children: ReactNode;
}

function TabsTrigger({ value, icon, count, children }: TabsTriggerProps) {
  const { activeValue, setActiveValue, baseId } = useTabsContext("Tabs.Trigger");

  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      className={`tabs-trigger ${isActive ? "active" : ""}`}
      onClick={() => setActiveValue(value)}
    >
      {icon && <span className="tabs-trigger-icon">{icon}</span>}

      <span>{children}</span>

      {count !== undefined && <span className="tabs-count">{count}</span>}
    </button>
  );
}

interface TabsPanelProps {
  value: string;
  children: ReactNode;
}

function TabsPanel({ value, children }: TabsPanelProps) {
  const { activeValue, baseId } = useTabsContext("Tabs.Panel");

  if (activeValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className="tabs-panel"
    >
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panel = TabsPanel;
