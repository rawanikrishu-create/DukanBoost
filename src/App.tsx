import React, { useState } from 'react';
import { DukaanProvider, useDukaan, ActiveView } from './context/DukaanContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { CustomersView } from './components/customers/CustomersView';
import { CustomerProfileModal } from './components/customers/CustomerProfileModal';
import { AddCustomerModal } from './components/customers/AddCustomerModal';
import { ProductsView } from './components/products/ProductsView';
import { ProductInsightModal } from './components/products/ProductInsightModal';
import { AddProductModal } from './components/products/AddProductModal';
import { SalesView } from './components/sales/SalesView';
import { RecordSaleModal } from './components/sales/RecordSaleModal';
import { ReceiptModal } from './components/sales/ReceiptModal';
import { CustomerEngagementView } from './components/whatsapp/CustomerEngagementView';
import { WhatsAppPreviewModal } from './components/whatsapp/WhatsAppPreviewModal';
import { DirectWhatsAppModal } from './components/whatsapp/DirectWhatsAppModal';
import { OffersView } from './components/offers/OffersView';
import { InsightsView } from './components/insights/InsightsView';
import { MarketInsightsView } from './components/market/MarketInsightsView';
import { SettingsView } from './components/setup/SettingsView';
import { OnboardingModal } from './components/setup/OnboardingModal';
import { LandingView } from './components/setup/LandingView';

function DukaanAppContent() {
  const { activeView } = useDukaan();
  const [showLanding, setShowLanding] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  if (showLanding) {
    return (
      <>
        <LandingView
          onEnterApp={() => setShowLanding(false)}
          onOpenSetup={() => {
            setShowLanding(false);
            setIsOnboardingOpen(true);
          }}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomersView />;
      case 'products':
        return <ProductsView />;
      case 'sales':
        return <SalesView />;
      case 'engagement':
        return <CustomerEngagementView />;
      case 'offers':
        return <OffersView />;
      case 'insights':
        return <InsightsView />;
      case 'market':
        return <MarketInsightsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenLanding={() => setShowLanding(true)}
        onOpenSetup={() => setIsOnboardingOpen(true)}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* All Operational Modals */}
      <RecordSaleModal />
      <ReceiptModal />
      <AddCustomerModal />
      <CustomerProfileModal />
      <AddProductModal />
      <ProductInsightModal />
      <WhatsAppPreviewModal />
      <DirectWhatsAppModal />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DukaanProvider>
        <DukaanAppContent />
      </DukaanProvider>
    </ErrorBoundary>
  );
}
