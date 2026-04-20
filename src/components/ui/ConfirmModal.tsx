"use client";

import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary";
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                </p>
                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                {confirmText}...
                            </div>
                        ) : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
