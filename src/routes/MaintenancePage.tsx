import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react'; 
import { motion } from 'framer-motion';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 text-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full border border-yellow-200"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <Icon
                icon="lucide:construction"
                className="text-yellow-600 w-20 h-20 drop-shadow-[0_6px_10px_rgba(255,186,0,0.3)]"
              />
            </motion.div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-4 drop-shadow-sm">
          🚧 Maintenance Ongoing
        </h1>
        <p className="text-gray-700 text-base md:text-lg max-w-md mx-auto mb-6 leading-relaxed">
          Our system is currently undergoing important upgrades to serve you better.
          We'll be back shortly. Thank you for your patience.
        </p>

        <Button
          size="lg"
          color="warning"
          variant="shadow"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
        >
          Try Again
        </Button>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
