/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import Content from "@/layout/content/Content";
import Head from "@/layout/head/Head";
import InvoiceDocument from "@/components/salon/InvoiceDocument";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Icon,
} from "@/components/Component";
import { salonApi } from "@/services/salonApi";
import { formatDate } from "@/utils/salonFormat";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    salonApi.invoices
      .get(invoiceId)
      .then((response) => {
        if (active) setInvoice(response.data);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [invoiceId]);

  return (
    <>
      <Head title="Invoice details" />
      <Content>
        <BlockHead>
          <BlockBetween className="g-3">
            <BlockHeadContent>
              <BlockTitle>
                Invoice{" "}
                <strong className="text-primary small">
                  #{invoice?.invoiceCode || "Loading"}
                </strong>
              </BlockTitle>
              {invoice && (
                <BlockDes className="text-soft">
                  <p>Created {formatDate(invoice.invoiceDate, true)}</p>
                </BlockDes>
              )}
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="d-flex gap-2">
                <Link to="/billing">
                  <Button color="light" outline>
                    <Icon name="arrow-left" /> Back
                  </Button>
                </Link>
                {invoice && (
                  <Link to={`/billing/invoices/${invoice.id}/print`} target="_blank">
                    <Button color="primary">
                      <Icon name="printer-fill" /> Print invoice
                    </Button>
                  </Link>
                )}
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          {error && <Alert color="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : (
            invoice && <InvoiceDocument invoice={invoice} />
          )}
        </Block>
      </Content>
    </>
  );
};

export default InvoiceDetails;

