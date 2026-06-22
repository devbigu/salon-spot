/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Button, Icon } from "@/components/Component";
import PageShell from "@/components/salon/PageShell";
import ResourcePanel from "@/components/salon/ResourcePanel";
import StatusBadge from "@/components/salon/StatusBadge";
import { useAuth } from "@/auth/AuthContext";
import { salonApi } from "@/services/salonApi";
import { formatMoney, roleCanManage } from "@/utils/salonFormat";

const ServiceCatalog = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("services");
  const [refs, setRefs] = useState({ salons: [], branches: [], mainServices: [] });
  const canManage = roleCanManage(user?.role);
  const isSuper = user?.role === "SUPER_ADMIN";

  const loadRefs = useCallback(async () => {
    const [salons, branches, categories] = await Promise.allSettled([
      isSuper ? salonApi.salons.list() : Promise.resolve({ data: [] }),
      user?.role === "STAFF"
        ? Promise.resolve({ data: [] })
        : salonApi.branches.list(),
      salonApi.mainServices.list(),
    ]);
    setRefs({
      salons: salons.status === "fulfilled" ? salons.value.data || [] : [],
      branches: branches.status === "fulfilled" ? branches.value.data || [] : [],
      mainServices:
        categories.status === "fulfilled" ? categories.value.data || [] : [],
    });
  }, [isSuper, user?.role]);

  useEffect(() => {
    loadRefs();
  }, [loadRefs]);

  const categoryFields = useMemo(
    () => [
      { name: "name", label: "Category name", required: true },
      ...(isSuper
        ? [
            {
              name: "salonId",
              label: "Salon",
              type: "select",
              required: true,
              options: refs.salons.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            },
          ]
        : []),
      { name: "status", label: "Active", type: "checkbox", defaultValue: true },
    ],
    [isSuper, refs.salons]
  );

  const serviceFields = useMemo(
    () => [
      { name: "name", label: "Service name", required: true },
      { name: "description", label: "Description", type: "textarea", fullWidth: true, nullable: true },
      { name: "price", label: "Price", type: "number", min: 0, step: "0.01", required: true },
      { name: "durationValue", label: "Duration", type: "number", min: 0, nullable: true },
      {
        name: "durationUnit",
        label: "Duration unit",
        type: "select",
        options: [
          { value: "MINUTES", label: "Minutes" },
          { value: "HOURS", label: "Hours" },
        ],
        defaultValue: "MINUTES",
      },
      {
        name: "mainServiceId",
        label: "Main category",
        type: "select",
        required: true,
        options: refs.mainServices.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      },
      {
        name: "branchId",
        label: "Branch",
        type: "select",
        nullable: true,
        options: refs.branches.map((item) => ({
          value: item.id,
          label: item.name,
        })),
        help: "Leave empty to make this service available to all branches.",
      },
      ...(isSuper
        ? [
            {
              name: "salonId",
              label: "Salon",
              type: "select",
              required: true,
              options: refs.salons.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            },
          ]
        : []),
      { name: "status", label: "Active", type: "checkbox", defaultValue: true },
    ],
    [isSuper, refs]
  );

  const statusAction = (api) =>
    canManage
      ? (row, reload, setError) => (
          <Button
            size="sm"
            color={row.status ? "warning" : "success"}
            outline
            onClick={async () => {
              try {
                await api.setStatus(row.id, !row.status);
                await reload();
                await loadRefs();
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            <Icon name={row.status ? "pause" : "play"} />
            {row.status ? "Disable" : "Enable"}
          </Button>
        )
      : undefined;

  return (
    <PageShell
      title="Service catalog"
      description="The service hierarchy, pricing, duration, and branch availability used by appointments and invoices."
    >
      <Nav tabs className="mt-n2 mb-4">
        <NavItem>
          <NavLink
            href="#services"
            active={tab === "services"}
            onClick={(event) => {
              event.preventDefault();
              setTab("services");
            }}
          >
            Services
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#categories"
            active={tab === "categories"}
            onClick={(event) => {
              event.preventDefault();
              setTab("categories");
            }}
          >
            Main categories
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={tab}>
        <TabPane tabId="services">
          <ResourcePanel
            title="Services"
            api={salonApi.services}
            canCreate={canManage}
            canEdit={canManage}
            canDelete={canManage}
            columns={[
              { key: "name", label: "Service" },
              { key: "mainService", label: "Category", render: (value) => value?.name || "—" },
              { key: "branch", label: "Branch", render: (value) => value?.name || "All branches" },
              { key: "price", label: "Price", render: formatMoney },
              {
                key: "durationValue",
                label: "Duration",
                render: (value, row) => (value ? `${value} ${row.durationUnit.toLowerCase()}` : "—"),
              },
              { key: "status", label: "Status", render: (value) => <StatusBadge value={value} /> },
            ]}
            fields={serviceFields}
            transformCreate={(values) => {
              const createValues = { ...values };
              delete createValues.status;
              return createValues;
            }}
            renderActions={statusAction(salonApi.services)}
          />
        </TabPane>
        <TabPane tabId="categories">
          <ResourcePanel
            title="Main services"
            api={salonApi.mainServices}
            canCreate={canManage}
            canEdit={canManage}
            canDelete={canManage}
            columns={[
              { key: "name", label: "Category" },
              { key: "salon", label: "Salon", render: (value) => value?.name || "Current salon" },
              { key: "status", label: "Status", render: (value) => <StatusBadge value={value} /> },
            ]}
            fields={categoryFields}
            renderActions={statusAction(salonApi.mainServices)}
          />
        </TabPane>
      </TabContent>
    </PageShell>
  );
};

export default ServiceCatalog;
