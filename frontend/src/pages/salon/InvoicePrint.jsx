import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import Content from "@/layout/content/Content";
import Head from "@/layout/head/Head";
import { Block, Button, Icon } from "@/components/Component";
import InvoiceDocument from "@/components/salon/InvoiceDocument";
import { salonApi } from "@/services/salonApi";

const InvoicePrint = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    salonApi.invoices
      .get(invoiceId)
      .then((response) => {
        if (active) setInvoice(response.data);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, [invoiceId]);

  useEffect(() => {
    if (!invoice) return undefined;
    const timer = window.setTimeout(() => window.print(), 700);
    return () => window.clearTimeout(timer);
  }, [invoice]);

  return (
    <>
      <Head title={`Invoice ${invoice?.invoiceCode || ""}`} />
      <Content>
        <Block>
          {error && <Alert color="danger">{error}</Alert>}
          {!invoice && !error ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : (
            invoice && (
              <>
                <div className="invoice-action">
                  <Button
                    size="lg"
                    color="primary"
                    outline
                    className="btn-icon btn-white btn-dim"
                    onClick={() => window.print()}
                  >
                    <Icon name="printer-fill" />
                  </Button>
                </div>
                <InvoiceDocument invoice={invoice} printable />
              </>
            )
          )}
        </Block>
      </Content>
    </>
  );
};

export default InvoicePrint;
