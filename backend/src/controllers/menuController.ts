import { Request, Response } from 'express';
import { MenuItem } from '../models/MenuItem';

export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
};

export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item', error });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const newMenuItem = new MenuItem(req.body);
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error });
  }
}; 