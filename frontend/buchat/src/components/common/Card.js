import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  noPadding = false,
  ...props
}) => {
  return (
    <motion.div
      className={`glass-card ${noPadding ? 'no-padding' : ''} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.3)' } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
