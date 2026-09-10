import { useMemo, useState } from "react";

import type { Employee } from "../types/employee.types";

/* Périmètre visible selon le rôle du compte connecté :
   - "all"  : super manager / admin, toutes les équipes
   - "team" : manager standard, uniquement son équipe
   - "self" : salarié standard, uniquement sa propre fiche */
export type OrgScope = "all" | "team" | "self";

interface OrganizationChartProps {
  employees: Employee[];
  scope?: OrgScope;
  viewerEmployeeId?: number | string | null;
  onSelect?: (employee: Employee) => void;
}

interface OrgNode {
  employee: Employee;
  children: OrgNode[];
  depth: number;
  total: number;
}

const DEPARTMENT_COLORS = [
  "#6366f1",
  "#2f6bff",
  "#f59f0a",
  "#10b981",
  "#ec4899",
  "#0ea5e9",
  "#8b5cf6",
  "#ef4444",
];

function departmentColor(department: string) {
  let hash = 0;

  for (let index = 0; index < department.length; index += 1) {
    hash = (hash * 31 + department.charCodeAt(index)) >>> 0;
  }

  return DEPARTMENT_COLORS[hash % DEPARTMENT_COLORS.length];
}

function initials(employee: Employee) {
  return `${employee.firstName.trim().charAt(0)}${employee.lastName
    .trim()
    .charAt(0)}`.toUpperCase();
}

function fullName(employee: Employee) {
  return `${employee.firstName.trim()} ${employee.lastName.trim()}`;
}

/* Les identifiants transitent tantôt en number, tantôt en string :
   toute comparaison hiérarchique passe par cette normalisation. */
function key(id: number | string | null | undefined) {
  return id === null || id === undefined ? null : String(id);
}

function buildTree(employees: Employee[]) {
  const nodes = new Map<string, OrgNode>();

  employees.forEach((employee) => {
    nodes.set(String(employee.id), {
      employee,
      children: [],
      depth: 0,
      total: 0,
    });
  });

  const roots: OrgNode[] = [];
  const orphans: OrgNode[] = [];

  nodes.forEach((node) => {
    const managerId = key(node.employee.managerId);
    const parent = managerId ? nodes.get(managerId) : undefined;

    if (!managerId) {
      roots.push(node);
      return;
    }

    if (!parent || parent === node) {
      orphans.push(node);
      return;
    }

    parent.children.push(node);
  });

  /* Un managerId qui boucle mettrait le rendu récursif en boucle infinie :
     on coupe la branche déjà visitée. */
  const visited = new Set<string>();

  function measure(node: OrgNode, depth: number): number {
    const id = String(node.employee.id);

    if (visited.has(id)) {
      node.children = [];
      return 0;
    }

    visited.add(id);

    node.depth = depth;
    node.children.sort((a, b) =>
      fullName(a.employee).localeCompare(fullName(b.employee), "fr"),
    );

    node.total = node.children.reduce(
      (accumulator, child) => accumulator + 1 + measure(child, depth + 1),
      0,
    );

    return node.total;
  }

  [...roots, ...orphans].forEach((node) => measure(node, 0));

  return { nodes, roots, orphans };
}

function rebase(node: OrgNode, depth: number): OrgNode {
  return {
    ...node,
    depth,
    children: node.children.map((child) => rebase(child, depth + 1)),
  };
}

/* Le filtre retire réellement les collaborateurs hors périmètre.
   Un responsable qui ne correspond pas est conservé uniquement s'il
   reste un subordonné visible sous lui, sinon la branche disparaît. */
function pruneByDepartment(node: OrgNode, department: string): OrgNode | null {
  const children = node.children
    .map((child) => pruneByDepartment(child, department))
    .filter((child): child is OrgNode => child !== null);

  if (node.employee.department !== department && children.length === 0) {
    return null;
  }

  return {
    ...node,
    children,
    total: children.reduce(
      (accumulator, child) => accumulator + 1 + child.total,
      0,
    ),
  };
}

function maxDepth(nodes: OrgNode[]): number {
  return nodes.reduce(
    (deepest, node) => Math.max(deepest, 1 + maxDepth(node.children)),
    0,
  );
}

function flatten(nodes: OrgNode[]): Employee[] {
  return nodes.flatMap((node) => [node.employee, ...flatten(node.children)]);
}

function Avatar({ employee }: { employee: Employee }) {
  return (
    <span
      className="org-avatar"
      style={{ background: departmentColor(employee.department) }}
    >
      {initials(employee)}

      {employee.avatar && (
        <img
          src={employee.avatar}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

interface OrgCardProps {
  node: OrgNode;
  collapsed: boolean;
  highlighted: boolean;
  onToggle: (id: string) => void;
  onSelect?: (employee: Employee) => void;
}

function OrgCard({
  node,
  collapsed,
  highlighted,
  onToggle,
  onSelect,
}: OrgCardProps) {
  const { employee } = node;
  const color = departmentColor(employee.department);
  const hasChildren = node.children.length > 0;

  return (
    <div
      className={`org-card${node.depth === 0 ? " lead" : ""}${
        highlighted ? " is-viewer" : ""
      }`}
      style={{ ["--org-accent" as string]: color }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(employee)}
      onKeyDown={(event) => {
        if (onSelect && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect(employee);
        }
      }}
    >
      <Avatar employee={employee} />

      <div className="org-card-body">
        <strong>{fullName(employee)}</strong>

        <span className="org-card-role">{employee.jobTitle}</span>

        <div className="org-card-meta">
          <span
            className="org-chip"
            style={{ color, borderColor: `${color}44` }}
          >
            {employee.department}
          </span>

          <span className="org-card-location">{employee.location}</span>
        </div>
      </div>

      <span
        className={`org-card-status ${employee.status}`}
        title={employee.status === "active" ? "Actif" : "Inactif"}
      />

      {highlighted && <span className="org-viewer-tag">Vous</span>}

      {hasChildren && (
        <button
          type="button"
          className="org-toggle"
          aria-expanded={!collapsed}
          aria-label={
            collapsed
              ? `Déplier l'équipe de ${fullName(employee)}`
              : `Replier l'équipe de ${fullName(employee)}`
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggle(String(employee.id));
          }}
        >
          {collapsed ? `+${node.total}` : "−"}
        </button>
      )}
    </div>
  );
}

interface OrgBranchProps {
  node: OrgNode;
  collapsedIds: Set<string>;
  viewerId: string | null;
  onToggle: (id: string) => void;
  onSelect?: (employee: Employee) => void;
}

function OrgBranch({
  node,
  collapsedIds,
  viewerId,
  onToggle,
  onSelect,
}: OrgBranchProps) {
  const nodeId = String(node.employee.id);
  const collapsed = collapsedIds.has(nodeId);
  const showChildren = node.children.length > 0 && !collapsed;

  return (
    <li className="org-node">
      <OrgCard
        node={node}
        collapsed={collapsed}
        highlighted={viewerId === nodeId}
        onToggle={onToggle}
        onSelect={onSelect}
      />

      {showChildren && (
        <ul className="org-branch">
          {node.children.map((child) => (
            <OrgBranch
              key={child.employee.id}
              node={child}
              collapsedIds={collapsedIds}
              viewerId={viewerId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function EmptyChart({
  title,
  description,
  message,
  hint,
}: {
  title: string;
  description: string;
  message: string;
  hint: string;
}) {
  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>{title}</h3>

          <p>{description}</p>
        </div>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">👥</div>

        <strong>{message}</strong>

        <p>{hint}</p>
      </div>
    </section>
  );
}

export default function OrganizationChart({
  employees,
  scope = "all",
  viewerEmployeeId = null,
  onSelect,
}: OrganizationChartProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [department, setDepartment] = useState("");

  const viewerId = key(viewerEmployeeId);

  const { roots, orphans, viewerNode } = useMemo(() => {
    const tree = buildTree(employees);

    return {
      roots: tree.roots,
      orphans: tree.orphans,
      viewerNode: viewerId ? (tree.nodes.get(viewerId) ?? null) : null,
    };
  }, [employees, viewerId]);

  /* Périmètre autorisé par le rôle, avant tout filtre d'affichage. */
  const scopedRoots = useMemo(() => {
    if (scope === "all") {
      return [...roots.filter((node) => node.children.length > 0)].sort(
        (a, b) => b.total - a.total,
      );
    }

    if (!viewerNode) {
      return [];
    }

    if (scope === "team") {
      return [rebase(viewerNode, 0)];
    }

    return [{ ...viewerNode, depth: 0, children: [], total: 0 }];
  }, [scope, roots, viewerNode]);

  const scopedUnassigned = useMemo(() => {
    if (scope !== "all") {
      return [];
    }

    return [
      ...roots.filter((node) => node.children.length === 0),
      ...orphans,
    ].sort((a, b) =>
      fullName(a.employee).localeCompare(fullName(b.employee), "fr"),
    );
  }, [scope, roots, orphans]);

  /* La liste déroulante reste complète même quand un filtre est actif. */
  const departments = useMemo(
    () =>
      [
        ...new Set(
          [
            ...flatten(scopedRoots),
            ...scopedUnassigned.map((node) => node.employee),
          ]
            .map((employee) => employee.department)
            .filter(Boolean),
        ),
      ].sort((a, b) => a.localeCompare(b, "fr")),
    [scopedRoots, scopedUnassigned],
  );

  const visibleRoots = useMemo(() => {
    if (!department) {
      return scopedRoots;
    }

    return scopedRoots
      .map((node) => pruneByDepartment(node, department))
      .filter((node): node is OrgNode => node !== null);
  }, [scopedRoots, department]);

  const visibleUnassigned = useMemo(() => {
    if (!department) {
      return scopedUnassigned;
    }

    return scopedUnassigned.filter(
      (node) => node.employee.department === department,
    );
  }, [scopedUnassigned, department]);

  /* Les compteurs décrivent ce qui est réellement affiché. */
  const visibleEmployees = useMemo(
    () => [
      ...flatten(visibleRoots),
      ...visibleUnassigned.map((node) => node.employee),
    ],
    [visibleRoots, visibleUnassigned],
  );

  const managerCount = useMemo(
    () =>
      new Set(
        visibleEmployees
          .map((employee) => key(employee.managerId))
          .filter((id): id is string => id !== null),
      ).size,
    [visibleEmployees],
  );

  const toggle = (id: string) => {
    setCollapsedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const collapseAll = () => {
    const ids = new Set<string>();

    const walk = (node: OrgNode) => {
      if (node.children.length > 0) {
        ids.add(String(node.employee.id));
        node.children.forEach(walk);
      }
    };

    visibleRoots.forEach(walk);

    setCollapsedIds(ids);
  };

  const title =
    scope === "all"
      ? "Organigramme"
      : scope === "team"
        ? "Mon équipe"
        : "Ma fiche";

  const description =
    scope === "all"
      ? "Structure hiérarchique de toutes les équipes"
      : scope === "team"
        ? "Les collaborateurs que vous encadrez"
        : "Votre position dans l'organisation";

  if (scope !== "all" && !viewerNode) {
    return (
      <EmptyChart
        title={title}
        description={description}
        message="Aucune fiche employé n'est rattachée à votre compte"
        hint="Contactez votre administrateur si cela vous semble incorrect."
      />
    );
  }

  if (scopedRoots.length === 0) {
    return (
      <EmptyChart
        title={title}
        description={description}
        message={
          scope === "all"
            ? "Aucune équipe constituée"
            : "Aucun collaborateur ne vous est rattaché"
        }
        hint="Contactez votre administrateur si cela vous semble incorrect."
      />
    );
  }

  const showToolbar = scope === "all";
  const showSummary = scope !== "self";
  const isFiltered = Boolean(department);
  const isEmptyAfterFilter =
    visibleRoots.length === 0 && visibleUnassigned.length === 0;

  return (
    <section className="dashboard-card organization-card">
      <div className="card-heading">
        <div>
          <h3>{title}</h3>

          <p>{isFiltered ? `Département filtré : ${department}` : description}</p>
        </div>

        {showToolbar && (
          <div className="org-toolbar">
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              <option value="">Tous les départements</option>

              {departments.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="org-action"
              onClick={() => setCollapsedIds(new Set())}
            >
              Tout déplier
            </button>

            <button type="button" className="org-action" onClick={collapseAll}>
              Tout replier
            </button>
          </div>
        )}
      </div>

      {showSummary && (
        <div className="org-summary">
          <div className="org-summary-item">
            <strong>{visibleEmployees.length}</strong>

            <span>{scope === "all" ? "Collaborateurs" : "Effectif"}</span>
          </div>

          <div className="org-summary-item">
            <strong>{managerCount}</strong>

            <span>Encadrants</span>
          </div>

          <div className="org-summary-item">
            <strong>{visibleRoots.length}</strong>

            <span>{visibleRoots.length > 1 ? "Équipes" : "Équipe"}</span>
          </div>

          <div className="org-summary-item">
            <strong>{maxDepth(visibleRoots)}</strong>

            <span>Niveaux</span>
          </div>
        </div>
      )}

      {isEmptyAfterFilter ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>

          <strong>Aucun collaborateur dans « {department} »</strong>

          <p>Choisissez un autre département pour revenir à l'organigramme.</p>
        </div>
      ) : (
        <div className="org-viewport">
          <div className={`org-forest${scope === "self" ? " is-solo" : ""}`}>
            {visibleRoots.map((node) => (
              <div className="org-unit" key={node.employee.id}>
                <ul className="org-branch org-branch-root">
                  <OrgBranch
                    node={node}
                    collapsedIds={collapsedIds}
                    viewerId={viewerId}
                    onToggle={toggle}
                    onSelect={onSelect}
                  />
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleUnassigned.length > 0 && (
        <div className="org-unassigned">
          <div className="org-unassigned-heading">
            <strong>Non rattachés</strong>

            <span>
              {visibleUnassigned.length} collaborateur
              {visibleUnassigned.length > 1 ? "s" : ""} sans responsable ni
              équipe
            </span>
          </div>

          <div className="org-unassigned-grid">
            {visibleUnassigned.map((node) => (
              <OrgCard
                key={node.employee.id}
                node={node}
                collapsed={false}
                highlighted={viewerId === String(node.employee.id)}
                onToggle={toggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
