import React, { useState, useEffect } from 'react';
import { getPaymentByOrderId } from '../../services/paymentDbService';
import { Link } from 'react-router-dom';
import {
  List,
 Button,
  Card,
  Typography,
} from '@material-tailwind/react';

const PaymentHandlePage = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const orderId = sessionStorage.getItem('paymentId');
        const paymentData = await getPaymentByOrderId(orderId);
        setPayment(paymentData.data);

        // localStorage.removeItem("formData");
        // localStorage.removeItem("membership");
        // localStorage.removeItem("price");
        // localStorage.removeItem("paymentId");
        // localStorage.removeItem("selectedCountryCode");
        // sessionStorage.removeItem("paymentCreated");
        sessionStorage.clear();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, []);

  if (loading) return <div>Cargando detalles del pago...</div>;
  if (error) return <div>Error al cargar el pago: {error.message}</div>;
  if (!payment) return <div>No se encontró el pago</div>;

  // Función para determinar el mensaje según el estado del pago
  const paymentStatusMessage = () => {
    switch (payment.status) {
      case 'PAID':
        return `Estimado ${payment.payer.name}, el pago de su ${payment.description} ha sido efectuado correctamente.`;
      case 'PENDING':
        return (
          <>
            {`Estimado ${payment.payer.name}, el pago de su ${payment.description} está procesando, por favor valide mas tarde o en la sección `}
            <Link to="/payment-history">historial de pagos</Link>
            {'.'}
          </>
        );
      case 'REJECTED':
        return `Estimado ${payment.payer.name}, el pago de su ${payment.description} ha sido rechazado.`;
      case 'CANCELLED':
        return `Estimado ${payment.payer.name}, el pago de su ${payment.description} ha sido cancelado.`;
      case 'EXPIRED':
        return `Estimado ${payment.payer.name}, el pago de su ${payment.description} ha expirado.`;
      default:
        return `Estimado ${payment.payer.name}, el estado de su pago (${payment.status}) es desconocido.`;
    }
  };

  return (
    <Card className="w-96 border-2">
        <Typography variant='h2'>Detalles del Pago</Typography>
      <List>
      <div>
        <Typography variant="h6" color="blue-gray">{paymentStatusMessage()}</Typography>
        <Typography variant="h6" color="blue-gray">
          Referencia del pago:{' '}
          <Typography variant="small" color="gray" className="font-normal">{payment.order_id}</Typography>
          {' - '}Id del pago:{' '}
          <Typography cvariant="small" color="gray" className="font-normal">{payment.payment_id}</Typography>
        </Typography>
        <Typography variant="h6" color="blue-gray">
          Total pagado:{' '}
          <Typography variant="small" color="gray" className="font-normal">
            {payment.currency} {payment.amount}
          </Typography>
        </Typography>
        
        <Button size='sm'>
          <Link to="/">
            Ir al Inicio
          </Link>
        </Button>
      </div>
      </List>
    </Card>
  );
};

export default PaymentHandlePage;
